module.exports = function maybeEnableMemoryDebugger() {
	if ( process.env.DEBUG_MEMORY ) {
		console.debug( 'Memory debugging enabled.' );
		setInterval( () => {
			const memoryUsage = process.memoryUsage();
			console.debug( '---' );
			for ( let key in memoryUsage ) {
				console.debug( `${ key }: ${ Math.round( memoryUsage[ key ] / 1024 / 1024 ) } MB` );
			}
			console.debug( '---' );
		}, 10000 );
	}
};
