module.exports = async ( request, reply ) => {
	const superagent = require( 'superagent' );
	const minify = require( '../lib/minify' );
	const compress = require( '../lib/compress' );
	const { envBool } = require( '../lib/util' );
	const { performance } = require( 'perf_hooks' );

	// 1) rawUrl might be:
	//    "/raw-get/https://automattic.com/_static/??-stuff&cssminify=yes"
	const rawUrl = request.raw.url;

	// 2) strip "/raw-get/" from the front
	let prefix = '/raw-get/';
	let finalUrl = rawUrl.startsWith( prefix ) ? rawUrl.slice( prefix.length ) : rawUrl;

	// 3) remove `cssminify=yes` if present
	// Do not use URL parameter parsing - it's too easy to destroy the "??" (double question) used in cssConcat
	let do_minify = false;

	const removeCssMinify =
		/(\?cssminify=yes&)|(\?cssminify=yes)|(&cssminify=yes&)|(&cssminify=yes)/gi;
	finalUrl = finalUrl.replace( removeCssMinify, ( match, g1, g2, g3, g4 ) => {
		// The presence of match means we found 'cssminify=yes'
		do_minify = true;

		if ( g1 ) {
			// "?cssminify=yes&" => remove 'cssminify=yes&', keep '?'
			return '?';
		}
		if ( g2 ) {
			// "?cssminify=yes" => remove entire thing
			return '';
		}
		if ( g3 ) {
			// "&cssminify=yes&" => remove 'cssminify=yes&', keep '&'
			return '&';
		}
		if ( g4 ) {
			// "&cssminify=yes" => remove entire thing
			return '';
		}
		return ''; // fallback, should never happen
	} );

	// Allow ?with=gzip or ?level=9 from the local query.
	let accept = request.headers[ 'accept-encoding' ];
	if ( typeof request.query.with === 'string' ) {
		accept = request.query.with;
	}
	let level = 5;
	if ( typeof request.query.level === 'string' ) {
		level = parseInt( request.query.level, 10 );
	}

	/*
	console.log({
		rawUrl,
		finalUrl,
		do_minify
	});
	*/

	// if finalUrl is empty or obviously invalid, handle that:
	if ( ! finalUrl.startsWith( 'http' ) ) {
		return reply.code( 400 ).send( { error: 'Invalid or missing URL' } );
	}

	// 4) fetch the resource
	const start = performance.now();
	try {
		const resp = await superagent.get( finalUrl );
		const ms = performance.now() - start;
		return sendReply( reply, resp, do_minify, accept, level, ms );
	} catch ( err ) {
		return reply.code( 502 ).send( { error: err.message } );
	}

	async function sendReply( reply, resp, doMinify, accept, level, ms ) {
		let body = resp.text || resp.body.toString();
		let contentType = resp.headers[ 'content-type' ] || '';

		let log = {
			origin_get_ms: parseInt( ms ),
			finalUrl,
			do_minify,
			contentType,
			original_size: body.length,
		};

		if ( ! doMinify ) {
			showLog( log );
			return reply
				.code( 200 )
				.header( 'Content-Type', contentType )
				.header( 'x-minify', 'f' )
				.send( body );
		}

		// Minify
		const minifyStart = performance.now();
		const [ minified, detectedType ] = await minify( body, contentType );
		log.minify_ms = parseInt( performance.now() - minifyStart );
		log.type = detectedType;
		log.minify_size = minified.length;
		log.minify_diff = log.original_size - log.minify_size;

		let finalBody = minified;
		let encoding = null;
		let doCompress = true;
		if ( envBool( 'MINIFIERS_DISABLE_COMPRESSION' ) ) {
			doCompress = false;
		} else if ( ! detectedType ) {
			doCompress = false;
		}
		if ( doCompress ) {
			const compressStart = performance.now();
			const [ compressed, enc ] = compress( minified, accept, level );
			if ( enc ) {
				encoding = enc;
				finalBody = compressed;
				log.compress_ms = parseInt( performance.now() - compressStart );
				log.compress_size = finalBody.length;
				log.compress_diff = log.minify_size - log.compress_size;
			}
		}

		showLog( log );
		const r = reply.code( 200 ).header( 'Content-Type', contentType );
		if ( encoding ) {
			r.header( 'Content-Encoding', encoding );
			r.header( 'x-minify-compression-level', level );
		}
		r.header( 'x-minify', 't' );
		r.send( finalBody );
	}

	function showLog( obj ) {
		if ( ! process.env.DEBUG_QUIET_REQUEST ) {
			console.log( JSON.stringify( obj ) );
		}
	}
};
