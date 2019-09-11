// Global vars
const version = '4.1.0';

// URL routes
const routes = {
	'/': require( './routes/home.js' ),
	'/health-check': require( './routes/health-check.js' )
};

// Resource types that we process instead of passing through
const process_types = {
	'css': {
		regex: new RegExp( /^text\/css/ ),
		min_func: require( './lib/css-min.js' ),
		type: 'string'
	},
	'html': { 
		regex: new RegExp( /^text\/html/ ),
		min_func: require( './lib/html-min.js' ),
		type: 'string'
	},
	'js': {
		regex: new RegExp( /^(application\/javascript)|(application\/x-javascript)|(application\/ecmascript)|(text\/javascript)|(text\/ecmascript)/ ),
		min_func: require( './lib/js-min.js' ),
		type: 'string'
	},
	'png': {
		regex: new RegExp( /^image\/png/ ),
		min_func: require( './lib/png-min.js' ),
		type: 'binary'
	},
	'svg': {
		regex: new RegExp( /^image\/svg\+xml/ ),
		min_func: require( './lib/svg-min.js' ),
		type: 'string'
	}
};

// Take care of command line options
const opt = require( 'node-getopt' ).create( [
	[ 'p', 'port=4000', 'The TCP port that the web server will listen on.', 4000 ],
	[ 'v', 'version', 'Show the version.' ]
] )
.bindHelp()
.parseSystem();

if ( opt.options.version ) {
	console.log( version );
	process.exit( 0 );
}

const my_url = 'http://localhost:' + opt.options.port;

// Modules
const http = require( 'http' );
const url = require( 'url' );
const log = require( './lib/log.js' );

// Get ready for work
log( { msg: 'Started at ' + my_url } );
http.createServer( ( request, response ) => {
	const url_parts = new URL( request.url, my_url );
	const route = routes[url_parts['pathname']];

	if ( route ) {
		route( request, response, url_parts, process_types );
	} else {
		log( { msg: 'No route: ' + url_parts['pathname'] } );

		response.writeHead( 404, { 'Content-Type': 'text/plain' } );
		response.end( 'No route' );
	}
} ).listen( opt.options.port );
