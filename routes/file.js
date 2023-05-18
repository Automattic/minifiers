module.exports = async ( request, reply ) => {
	const fs = require( 'fs' );
	const fs_path = require( 'path' );
	const mime = require( 'mime-types' );
	const minify = require( '../lib/minify' );
	const compress = require( '../lib/compress' );
	const validatePath = require( '../lib/validate-path' );
	const { envBool } = require( '../lib/util' );
	const { PerformanceObserver, performance } = require( 'perf_hooks' );

	let log = {};

	const userPath = request.query.path;

	// Check user's path falls in the base path.
	const path = validatePath( userPath );
	if ( ! path ) {
		// Error should look the same as a stat failed, in order to
		// not leak information
		const err = new Error( `ENOENT: no such file or directory, open '${ userPath }'` );
		err.code = 'ENOENT';
		send_error( reply, err, 404, 10501 );
		return;
	}

	log.path = path;

	let accept = request.headers[ 'accept-encoding' ];
	if ( typeof request.query.with === 'string' ) {
		accept = request.query.with;
	}

	let level = 5;
	if ( typeof request.query.level === 'string' ) {
		level = parseInt( request.query.level );
	}

	let do_minify = true;
	if ( typeof request.query.minify === 'string' && request.query.minify === 'false' ) {
		do_minify = false;
	}

	if ( path.match( /\.(dev|min)\./ ) ) {
		do_minify = false;
	}
	log.minify = do_minify;
	let use_cache = false;

	let file_stat;
	let etag;

	try {
		file_stat = fs.statSync( path );
		etag = 'W/' + file_stat.size + '-' + file_stat.mtimeMs;
	} catch ( error ) {
		console.log( error );
		send_error( reply, error, 404, 10501 );
	}

	if ( ! do_minify ) {
		try {
			await send_reply( fs.readFileSync( path ).toString(), reply, accept, level );
		} catch ( err ) {
			console.log( err );
			send_error( reply, err, 404, 10404 );
		}
	}

	log.cache = 'no';
	let read_from = path;
	const cache_file = '/dev/shm/a8c-minify/' + path;
	if ( fs.existsSync( '/dev/shm' ) ) {
		if ( ! fs.existsSync( '/dev/shm/a8c-minify' ) ) {
			fs.mkdirSync( '/dev/shm/a8c-minify' );
		}

		use_cache = true;
		log.cache = 'miss';
		if ( fs.existsSync( cache_file ) ) {
			const cache_stat = fs.statSync( '/dev/shm/a8c-minify/' + path );

			if ( cache_stat.mtimeMs > file_stat.mtimeMs ) {
				log.cache = 'hit';
				read_from = cache_file;
			}
		}
	}

	// Go get the original
	const origin_start = performance.now();
	try {
		await send_reply( fs.readFileSync( read_from ).toString(), reply, accept, level );
	} catch ( err ) {
		console.log( err );
		send_error( reply, err, 404, 10404 );
	}
	log.origin_get_ms = parseInt( performance.now() - origin_start );

	async function send_reply( body, reply, accept, level ) {
		let encoding = '';
		let type = false;
		let content_type = mime.lookup( path );

		if ( do_minify === false ) {
			show_log( log );

			reply
				.code( 200 )
				.header( 'Content-Type', content_type )
				.header( 'x-minify', 'f' )
				.header( 'x-minify-cache', 'no' );

			if ( typeof etag === 'string' ) {
				reply.header( 'Etag', etag );
			}

			reply.send( body );
		}

		log.original_size = body.length;

		const minify_start = performance.now();
		[ body, type ] = await minify( body, content_type );
		log.minify_ms = parseInt( performance.now() - minify_start );
		log.type = type;
		log.minify_size = body.length;
		log.minify_size_diff = log.original_size - log.minify_size;
		log.minify_size_diff_percent = parseInt( ( log.minify_size_diff / log.original_size ) * 100 );

		if ( use_cache ) {
			try {
				fs.mkdirSync( fs_path.dirname( cache_file ), { recursive: true } );
				fs.writeFileSync( cache_file, body );
			} catch ( err ) {
				console.log( err );
				send_error( reply, err );
			}
		}

		let do_compress = true;
		if ( envBool( 'MINIFIERS_DISABLE_COMPRESSION' ) ) {
			do_compress = false;
		} else if ( type === false ) {
			// If no type was matched then we are in a pass through condition,
			// in which case we skip compression and go directly to providing
			// the original version back.
			do_compress = false;
		}

		if ( do_compress ) {
			const compress_start = performance.now();
			[ body, encoding ] = compress( body, accept, level );
			if ( encoding !== null ) {
				log.compress_ms = parseInt( performance.now() - compress_start );
				log.compress_size = body.length;
				log.compress_size_diff = log.minify_size - log.compress_size;
				log.compress_size_diff_percent = parseInt(
					( log.compress_size_diff / log.minify_size ) * 100
				);
			}
		}

		show_log( log );
		reply.code( 200 );
		reply.header( 'Content-Type', content_type );
		if ( encoding !== '' && encoding !== null ) {
			reply.header( 'Content-Encoding', encoding );
			reply.header( 'x-minify-compression-level', level );
		}
		reply.header( 'x-minify', 't' );
		reply.header( 'x-minify-cache', log.cache );

		if ( typeof etag === 'string' ) {
			reply.header( 'Etag', etag );
		}

		reply.send( body );
	}

	function send_error( reply, err, http_code = 500, error_code = 10000 ) {
		log.error = err;
		show_log( log );
		reply
			.code( http_code )
			.header( 'Content-Type', 'application/json' )
			.header( 'x-minify-error-code', error_code )
			.send( {
				status: 'error',
				code: error_code,
				msg: 'Error requesting the original resource',
			} );
	}

	function show_log( msg ) {
		if ( process.env.DEBUG_QUIET_REQUEST ) {
			return;
		}
		const time_stamp = new Date();
		msg.when = time_stamp.toISOString();
		console.log( JSON.stringify( msg ) );
	}
};
