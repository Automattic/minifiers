const { startServer, getSharedServerPort } = require( './test-server-utils' );

module.exports = async () => {
	const { server: serverInstance, port } = await startServer(
		{
			MINIFIERS_MIN_CHILD_PROCESSES: '1',
		},
		getSharedServerPort()
	);
	global.__TEST_SERVER__ = serverInstance;
	global.__TEST_SERVER_PORT__ = port;
};
