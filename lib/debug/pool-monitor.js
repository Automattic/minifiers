const { envBool } = require( '../util' );
module.exports = function maybeEnablePoolMonitor( pool ) {
	if ( envBool( 'DEBUG_POOL' ) ) {
		const printPoolInfo = () => {
			console.debug( 'spareResourceCapacity:', pool.spareResourceCapacity );
			console.debug( 'size:', pool.size );
			console.debug( 'available:', pool.available );
			console.debug( 'borrowed:', pool.borrowed );
			console.debug( 'pending:', pool.pending );
			console.debug( 'max:', pool.max );
			console.debug( 'min:', pool.min );
		};

		console.debug( 'Pool monitoring enabled.' );
		printPoolInfo();
		setInterval( printPoolInfo, 10000 );
	}
};
