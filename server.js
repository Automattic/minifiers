'use strict';

const server = require( 'fastify' )( {
	logger: true,
	maxParamLength: 50000, // this defaults to 100, which is way too small
} );

// Routes
server.get( '/', require( './routes/index' ) );
server.get( '/health-check', require( './routes/health-check' ) );
server.get( '/file', require( './routes/file' ) );

server.get( '/get', require( './routes/get' ) );
server.options( '/get', require( './routes/get' ) );

// Take care of command line options
const opt = require( 'node-getopt' )
	.create( [ [ 'p', 'port=4747', 'The TCP port that the web server will listen on.', 4747 ] ] )
	.bindHelp()
	.parseSystem();

// Run the server
server.listen(
	{
		port: opt.options.port,
		host: '0.0.0.0',
	},
	( err, address ) => {
		// If this happens something very bad has happened, end of the world.
		if ( err ) {
			console.log( err );
			process.exit( 1 );
		}
	}
);
