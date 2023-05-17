module.exports = function maybeEnableMemoryDebugger() {
	if ( process.env.DEBUG_MEMORY ) {
		console.log( 'Memory debugging enabled' );
		setInterval( () => {
			const memoryUsage = process.memoryUsage();
			console.log( '---' );
			for ( let key in memoryUsage ) {
				console.log( `${ key }: ${ Math.round( memoryUsage[ key ] / 1024 / 1024 ) } MB` );
			}
			console.log( '---' );
		}, 10000 );
	}
};
