'use strict';

const server = require( 'fastify' )( {
	logger: true
} );

// Routes
server.get( '/', require( './routes/index' ) );
server.get( '/health-check', require( './routes/health-check' ) );
server.get( '/get', require( './routes/get' ) );

// Run the server
server.listen(
	{
		port: 4747,
		host: '0.0.0.0'
	},
	( err, address ) => {
		// If this happens something very bad has happened, end of the world.
		if ( err ) {
			server.log.error( err );
			process.exit( 1 );
		}
	}
);
