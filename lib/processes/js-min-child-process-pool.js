// This manages a pool of child processes, and is used by js-min-parent.js.
const { fork } = require( 'child_process' );
const { createPool } = require( 'generic-pool' );
const path = require( 'path' );
const maybeEnablePoolMonitor = require( '../debug/pool-monitor' );
const os = require( 'os' );

const factory = {
	create: function () {
		return new Promise( function ( resolve, reject ) {
			const childScriptPath = path.join( __dirname, 'js-min-child.js' );
			const child = fork( childScriptPath );
			child.count = 0;

			child.on( 'error', reject );
			resolve( child );
		} );
	},
	destroy: function ( child ) {
		return new Promise( function ( resolve, reject ) {
			child.removeAllListeners( 'error' );
			child.removeAllListeners( 'exit' );
			child.on( 'exit', resolve );
			child.on( 'error', reject );

			child.kill( 'SIGTERM' );
		} );
	},
};

const opts = {
	min: parseInt( process.env.MINIFIERS_MIN_CHILD_PROCESSES, 10 ) || os.cpus().length,
	max: parseInt( process.env.MINIFIERS_MAX_CHILD_PROCESSES, 10 ) || os.cpus().length * 2,
	evictionRunIntervalMillis: parseInt( process.env.MINIFIERS_EVICTION_INTERVAL, 10 ) || 10000,
	softIdleTimeoutMillis: parseInt( process.env.MINIFIERS_SOFT_IDLE_TIMEOUT, 10 ) || 10000,
	idleTimeoutMillis: parseInt( process.env.MINIFIERS_IDLE_TIMEOUT, 10 ) || 30000,
};

const childProcessPool = createPool( factory, opts );
maybeEnablePoolMonitor( childProcessPool );

module.exports = childProcessPool;
