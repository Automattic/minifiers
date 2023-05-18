const { stopServer } = require( './test-server-utils' );

module.exports = async () => {
	console.log( 'trying to shut the server down', global.__TEST_SERVER__ );
	await stopServer( global.__TEST_SERVER__ );
	console.log( 'global teardown' );
};
