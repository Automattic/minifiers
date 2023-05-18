// This manages a pool of child processes, and is used by js-min-parent.js.
const { fork } = require( 'child_process' );
const { createPool } = require( 'generic-pool' );
const path = require( 'path' );
const maybeEnablePoolMonitor = require( '../debug/pool-monitor' );
const os = require( 'os' );

const factory = {
	create: function () {
		console.log( 'Creating child process' );
		return new Promise( function ( resolve, reject ) {
			const childScriptPath = path.join( __dirname, 'js-min-child.js' );
			const child = fork( childScriptPath );
			child.count = 0;

			child.on( 'error', reject );
			resolve( child );
		} );
	},
	destroy: function ( child ) {
		console.log( 'Destroying child process' );
		return new Promise( function ( resolve, reject ) {
			child.removeAllListeners( 'error' );
			child.removeAllListeners( 'exit' );
			child.on( 'exit', () => {
				console.log( 'Child process exited' );
				resolve();
			} );
			child.on( 'error', () => {
				console.log( 'error!!' );
				reject();
			} );

			//process.kill( child.pid, 'SIGTERM' );
			child.kill();
		} );
	},
};

const opts = {
	min: 0, // parseInt( process.env.MINIFIERS_MIN_CHILD_PROCESSES, 10 ) || os.cpus().length,
	max: parseInt( process.env.MINIFIERS_MAX_CHILD_PROCESSES, 10 ) || os.cpus().length * 2,
	evictionRunIntervalMillis: parseInt( process.env.MINIFIERS_EVICTION_INTERVAL, 10 ) || 10000,
	softIdleTimeoutMillis: parseInt( process.env.MINIFIERS_SOFT_IDLE_TIMEOUT, 10 ) || 10000,
	idleTimeoutMillis: parseInt( process.env.MINIFIERS_IDLE_TIMEOUT, 10 ) || 30000,
};

const childProcessPool = createPool( factory, opts );
maybeEnablePoolMonitor( childProcessPool );

process.on( 'SIGINT', async () => {
	setTimeout( () => {
		console.log( '!! int timeout !!' );
		process.exit( 1 );
	}, 40000 );
	console.log( '!! int !!' );
	await childProcessPool.drain();
	process.exit( 0 );
} );

process.on( 'SIGTERM', async () => {
	setTimeout( () => {
		console.log( '!! term timeout !!' );
		process.exit( 1 );
	}, 40000 );
	console.log( '!! term !!' );
	await childProcessPool.drain();
	process.exit( 0 );
} );

module.exports = childProcessPool;
