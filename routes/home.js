module.exports = ( request, response, url_parts, process_types ) => {
	const got = require( 'got' );
	const { PerformanceObserver, performance } = require( 'perf_hooks' );
	const log = require( '../lib/log.js' );
	const compress = require( '../lib/compress.js' );
	const origin_log = require( '../lib/origin-log.js' );

	// We need a valid looking URL to go get
	let origin_url = url_parts.searchParams.get( 'url' );
	if ( typeof( origin_url ) !== 'string' || origin_url === '' ) {
		log( { msg: 'Invalid origin URL' } );

		response.writeHead( 404, { 'Content-Type': 'text/plain' } );
		response.end( '' );
        return;
    }

	origin_url = new URL( origin_url ).href;

	// Look for compression options in the URL
	let compression_type = request.headers['accept-encoding'];
	let compression_level = 1;

	let compress_opt = url_parts.searchParams.get( 'http-compression' );
	if ( url_parts.searchParams.has( 'http-compression' ) ) {
		let compression = compress_opt.match(/^(br|gzip)-?(\d)?$/);
		if ( compression !== null ) {
			compression_type = compression[1];

			if ( typeof compression[2] === 'string' ) {
				compression_level = parseInt( compression[2] );
			}
		}
	}

	// Go get the original
	( async () => {
		try {
			const got_response = await got( origin_url, { encoding: null } );
			const content_type = got_response.headers['content-type'].toLowerCase();
			response.writeHead( 200, { 'Content-Type': content_type } );

			let minify_start = 0;
			let minify_stop = 0;

			// Minify the response, if it is one of the types we support
			for ( let t in process_types ) {
				let type_check = process_types[t];

				if ( type_check.regex.test( content_type ) ) {
					let content = got_response.body;
					if ( type_check.type === 'string' ) {
						content = content.toString();
					}

					minify_start = performance.now();
					let result = await type_check.min_func( content );

					minify_stop = performance.now();

					origin_log(
						origin_url,
						t,
						got_response.timings.phases,
						content.length,
						result.length,
						minify_stop - minify_start
					);

					result = compress(
						response,
						result,
						compression_type,
						compression_level
					);

					response.end( result );
					return;
				}
			}

			// If we are still here, give it back unchanged
			origin_log(
				origin_url,
				'pass-through',
				got_response.timings.phases,
				got_response.body.length,
				got_response.body.length,	// there is no minified version
				0					// no minification is infinitely fast
			);
			response.end( got_response.body );
		} catch ( e ) {
			log( { 'error': 'Error getting origin URL: ' + origin_url } );

			response.writeHead( 500, { 'Content-Type': 'text/plain' } );
			response.end( 'Error 10000: something went wrong' );
		}
	} )();
};
