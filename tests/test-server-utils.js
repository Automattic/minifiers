const { exec } = require( 'child_process' );

/**
 * Generates a random port number between 3000 and 9000.
 * Since each test file spawns its own server, and they run in parallel,
 * we need to make sure that each server is listening on a different port.
 *
 * @returns {int}
 */
function generateRandomPort() {
	return Math.floor( Math.random() * 6000 ) + 3000;
}
function getSharedServerPort() {
	return 4749;
}

/**
 * Starts a server with the provided environment variables.
 *
 * @param {object} env - An object containing environment variables for the server.
 * @returns {Promise} A Promise that resolves to an object containing the server instance
 *                    and the port it is listening on.
 */
function startServer( env, port = null ) {
	return new Promise( ( resolve, reject ) => {
		if ( port === null ) {
			port = generateRandomPort();
		}
		const server = exec(
			`npm start -- -p ${ port }`,
			{ env: { ...process.env, ...env } },
			( error ) => {
				if ( error ) {
					reject( error );
				}
			}
		);
		server.stdout.on( 'data', ( data ) => {
			if ( data.includes( 'Server listening' ) ) {
				resolve( { server, port } );
			}
		} );
	} );
}

/**
 * Stops a running server.
 *
 * @param {object} server - The server instance to be stopped.
 * @returns {Promise} A Promise that resolves when the server is stopped.
 */
function stopServer( server ) {
	return new Promise( ( resolve, reject ) => {
		server.kill( 'SIGTERM' );
		// After 5 seconds, send SIGKILL if the server is still running
		const sigkillTimeout = setTimeout( () => {
			if ( !server.killed ) {
				console.log( 'Server still running after 5 seconds, sending SIGKILL' );
				server.kill( 'SIGKILL' );
			} else {
				console.log( 'Server stopped' );
			}
		}, 5000 );
		// Set a timeout to reject the promise if the server doesn't stop after 10 seconds
		const rejectTimeout = setTimeout( () => {
			console.log( 'Server shutdown timeout' );
			reject( new Error( 'Server shutdown timeout' ) );
		}, 10000 );
		server.on( 'exit', () => {
			console.log('!!!!!!!! server exit !!!!!!!!');
			clearTimeout( sigkillTimeout );
			clearTimeout( rejectTimeout );
			resolve();
		} );
		server.on( 'error', reject );
	} );
}

module.exports = { stopServer, startServer, getSharedServerPort };
