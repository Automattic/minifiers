const { startServer, getSharedServerPort } = require( './test-server-utils' );

module.exports = async () => {
	const { server: serverInstance, port } = await startServer(
		{
			MINIFIERS_MIN_CHILD_PROCESSES: '0',
			MINIFIERS_SOFT_IDLE_TIMEOUT: '1000',
			MINIFIERS_IDLE_TIMEOUT: '1000',
		},
		getSharedServerPort()
	);
	console.log('server started', serverInstance.pid, serverInstance.spawnargs);
	global.__TEST_SERVER__ = serverInstance;
	global.__TEST_SERVER_PORT__ = port;
};
