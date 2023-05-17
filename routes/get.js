module.exports = ( request, reply ) => {
	const superagent = require( 'superagent' );
	const minify = require( '../lib/minify' );
	const compress = require( '../lib/compress' );
	const { PerformanceObserver, performance } = require( 'perf_hooks' );

	const url = request.query.url;

	let log = {};
	log.url = url;

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
	log.minify = do_minify;

	// Go get the original
	const origin_start = performance.now();
	superagent
		.get( url )
		.then( ( resp ) => send_reply( reply, resp, accept, level ) )
		.catch( ( err ) => send_error( reply, err ) );
	log.origin_get_ms = parseInt( performance.now() - origin_start );

	async function send_reply( reply, resp, accept, level ) {
		let encoding = '';
		let body = '';
		let type = false;

		// Some items, like SVG, use body instead
		body = resp.text || resp.body.toString();

		if ( do_minify === false ) {
			show_log( log );
			reply
				.code( 200 )
				.header( 'Content-Type', resp.headers[ 'content-type' ] )
				.header( 'x-minify', 'f' )
				.send( body );
		}

		log.original_size = body.length;

		const minify_start = performance.now();
		[ body, type ] = await minify( body, resp.header[ 'content-type' ] );
		log.minify_ms = parseInt( performance.now() - minify_start );
		log.type = type;
		log.minify_size = body.length;
		log.minify_size_diff = log.original_size - log.minify_size;
		log.minify_size_diff_percent = parseInt( ( log.minify_size_diff / log.original_size ) * 100 );

		let do_compress = true;
		if ( process.env.MINIFIERS_DISABLE_COMPRESSION ) {
			do_compress = false;
		} else if ( type === false ) {
			// If no type was matched then we are in a pass through condition,
			// in which case we skip compression and go directly to providing
			// the original version back.
			do_compress = false;
		}

		// If no type was matched then we are in a pass through condition,
		// in which case we skip compression and go directly to providing
		// the original version back.
		if ( do_compress ) {
			const compress_start = performance.now();
			[ body, encoding ] = compress( body, accept, level );
			log.compress_ms = parseInt( performance.now() - compress_start );
			log.compress_size = body.length;
			log.compress_size_diff = log.minify_size - log.compress_size;
			log.compress_size_diff_percent = parseInt(
				( log.compress_size_diff / log.minify_size ) * 100
			);
		}

		show_log( log );
		reply
			.code( 200 )
			.header( 'Content-Type', resp.headers[ 'content-type' ] )
			.header( 'Content-Encoding', encoding )
			.header( 'x-minify-compression-level', level )
			.header( 'x-minify', 't' )
			.send( body );
	}

	function send_error( reply, err ) {
		if ( err instanceof Error ) {
			log.error = err.message;
		} else {
			log.error = err;
		}
		show_log( log );
		reply
			.code( 500 )
			.header( 'Content-Type', 'application/json' )
			.header( 'x-minify-error-code', 10000 )
			.send( {
				status: 'error',
				code: 10000,
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
