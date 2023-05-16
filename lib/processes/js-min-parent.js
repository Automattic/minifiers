// This version runs the minification in a child process, and uses a pool
// of child processes to avoid the overhead of creating a new child process
// for every request.
// Used to workaround a memory leak (or unbounded cache) in swc.
// For a version that runs in-line, see: ./lib/js-min.js.
const pool = require( './js-min-child-process-pool' );

module.exports = async function ( body ) {
	const child = await pool.acquire();

	return new Promise( ( resolve, reject ) => {
		child.removeAllListeners( 'message' );
		child.once( 'message', ( minifiedData ) => {
			resolve( minifiedData );

			child.count++;
			if ( child.count >= 50 ) {
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

		child.send( body );
	} );
};
