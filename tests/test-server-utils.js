const { exec } = require( 'child_process' );

function generateRandomPort() {
	return Math.floor( Math.random() * 6000 ) + 3000;
}

/**
 * Wraps a suite of tests with server setup and teardown. Starts the server before all tests,
 * and stops it after all tests have finished.
 *
 * @param {string} description - The description of the test suite.
 * @param {object} env - An object containing environment variables for the server.
 * @param {function} tests - A function containing all the tests for the suite. This function
 *                           takes a 'request' parameter, which is a supertest object configured
 *                           to send requests to the server.
 */
function startServer( env ) {
	return new Promise( ( resolve, reject ) => {
		const port = generateRandomPort();
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
		server.on( 'exit', resolve );
		server.on( 'error', reject );
	} );
}

module.exports = { stopServer, startServer };
