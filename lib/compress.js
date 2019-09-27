module.exports = ( response, body, accept_encoding ) => {
	const zlib = require( 'zlib' );

	if ( typeof accept_encoding != 'string' ) {
		return body;
	}

	let encodings = accept_encoding.split(',').map( entry => entry.trim() );
	if ( encodings.includes( 'br' ) ) {
		response.writeHead( 200, { 'Content-Encoding': 'br' } );
		return zlib.brotliCompressSync( body, { level: 9 } );
	} else if ( encodings.includes( 'gzip' ) ) {
		response.writeHead( 200, { 'Content-Encoding': 'gzip' } );
		return zlib.gzipSync( body, { level: 9 } );
	} else if ( encodings.includes( 'deflate' ) ) {
		response.writeHead( 200, { 'Content-Encoding': 'deflate' } );
		return zlib.deflateSync( body, { level: 9 } );
	} else {
		// If we are still here return the content without compression
		return body;
	}
};
