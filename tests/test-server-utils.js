const { spawn } = require( 'child_process' );

/**
 * Generates a random port number between 3000 and 9000.
 * Since each test file can spawn its own server, and they run in parallel,
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
		const server = spawn(
			'node',
			[ './server.js', `--port=${ port }` ],
			{ env: { ...process.env, ...env } },
			( error ) => {
				if ( error ) {
					console.error( 'Error starting server', error );
					reject( error );
				}
			}
		);
		server.stdout.on( 'data', ( data ) => {
			if ( data.includes( 'Server listening' ) ) {
				resolve( { server, port } );
			}
		} );

		server.stderr.on( 'data', ( data ) => {
			console.info( `stderr: ${ data }` );
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
		server.on( 'exit', resolve );
		server.on( 'error', reject );
	} );
}

module.exports = { stopServer, startServer, getSharedServerPort };
