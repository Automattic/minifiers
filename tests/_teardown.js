const { stopServer } = require( './test-server-utils' );

module.exports = async () => {
	await stopServer( global.__TEST_SERVER__ );
};
