const { stopServer } = require( './test-server-utils' );

module.exports = async () => {
	console.log('Running stop server..');
	await stopServer( global.__TEST_SERVER__ );
	console.log('Finished.');
};
