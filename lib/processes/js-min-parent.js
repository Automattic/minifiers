// This version runs the minification in a child process, and uses a pool
// of child processes to avoid the overhead of creating a new child process
// for every request.
// Used to workaround a memory leak (or unbounded cache) in swc.
// For a version that runs in-line, see: ./lib/js-min.js.

// How many minifications to run before destroying the child process.
const MINIFICATIONS_PER_PROCESS = 50;

const pool = require( './js-min-child-process-pool' );

module.exports = async function ( body ) {
	const child = await pool.acquire();

	return new Promise( ( resolve, reject ) => {
		child.removeAllListeners( 'message' );
		child.once( 'message', ( message ) => {
			if ( message.type === 'success' ) {
				const minifiedData = message.data;
				resolve( minifiedData );
			} else if ( message.type === 'error' ) {
				reject( new Error( message.data ) );
			} else {
				reject( new Error( 'Unknown message type: ' + message.type ) );
			}

			child.count++;
			if ( child.count >= MINIFICATIONS_PER_PROCESS ) {
				pool.destroy( child );
			} else {
				pool.release( child );
			}
		} );

		child.removeAllListeners( 'error' );
		child.once( 'error', ( err ) => {
			reject( err );
			pool.destroy( child );
		} );

		child.removeAllListeners( 'exit' );
		child.once( 'exit', ( err ) => {
			reject( err );
			pool.destroy( child );
		} );

		child.send( body );
	} );
};
