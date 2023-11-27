'use strict';

const { envBool } = require( './lib/util' );
const maybeEnableMemoryDebugger = require( './lib/debug/memory-debugger' );
maybeEnableMemoryDebugger();

const server = require( 'fastify' )( {
	logger: envBool( 'DEBUG_QUIET_REQUEST' ) ? false : true,
	maxParamLength: 50000, // this defaults to 100, which is way too small
} );
if ( envBool( 'DEBUG_QUIET_REQUEST' ) ) {
	console.debug( 'Quiet mode enabled.' );
}
if ( envBool( 'MINIFIERS_DISABLE_COMPRESSION' ) ) {
	console.debug( 'Compression disabled.' );
}

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

// Handle shutdown signals
[ 'SIGINT', 'SIGTERM' ].forEach( ( signal ) => {
	process.on( signal, () => {
		console.log( `Received ${ signal }, shutting down...` );

		server.close( ( err ) => {
			if ( err ) {
				console.error( 'Error during shutdown:', err );
				process.exit( 1 );
			}
			console.log( 'Server closed' );
			process.exit( 0 );
		} );
	} );
} );

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
	},
);
