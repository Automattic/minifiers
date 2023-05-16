// This should be forked as a child process.
process.on( 'message', ( body ) => {
	const swc = require( '@swc/core' );
	const result = swc.minifySync( body, {
		compress: false,
		mangle: true,
	} );

	process.send( result.code );
} );
