// This should be forked as a child process.
process.on( 'message', ( body ) => {
	const swc = require( '@swc/core' );
	try {
		const result = swc.minifySync( body, {
			compress: false,
			mangle: true,
		} );
		process.send( { type: 'success', data: result.code } );
	} catch ( error ) {
		process.send( { type: 'error', data: error.message } );
	}
} );

function handleChildSignal() {
	console.log( 'Child process received signal' );
	process.exit( 0 );
}

process.on( 'SIGINT', handleChildSignal );
process.on( 'SIGTERM', handleChildSignal );
