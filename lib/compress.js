module.exports = ( body, accept, level = 5 ) => {
	const zlib = require( 'zlib' );

	if ( typeof accept != 'string' ) {
		return [ body ];
	}

	let encodings = accept.split( ',' ).map( ( entry ) => entry.trim() );
	if ( encodings.includes( 'br' ) ) {
		return [ zlib.brotliCompressSync( body, { level: level } ), 'br' ];
	} else if ( encodings.includes( 'gzip' ) ) {
		return [ zlib.gzipSync( body, { level: level } ), 'gzip' ];
	} else if ( encodings.includes( 'deflate' ) ) {
		return [ zlib.deflateSync( body, { level: level } ), 'deflate' ];
	} else {
		// If we are still here return the content without compression
		return body;
	}
};
