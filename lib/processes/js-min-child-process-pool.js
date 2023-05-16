// This manages a pool of child processes, and is used by js-min-parent.js.
const { fork } = require( 'child_process' );
const { createPool } = require( 'generic-pool' );
const path = require( 'path' );

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

			child.kill();
		} );
	},
};

const opts = {
	min: 4,
	max: 32,
	evictionRunIntervalMillis: 10000,
	softIdleTimeoutMillis: 10000,
	idleTimeoutMillis: 30000,
};

const childProcessPool = createPool( factory, opts );

module.exports = childProcessPool;
