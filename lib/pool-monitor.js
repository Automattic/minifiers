module.exports = function maybeEnablePoolMonitor( pool ) {
	if ( process.env.DEBUG_POOL ) {
		const printPoolInfo = () => {
			console.log( 'spareResourceCapacity:', pool.spareResourceCapacity );
			console.log( 'size:', pool.size );
			console.log( 'available:', pool.available );
			console.log( 'borrowed:', pool.borrowed );
			console.log( 'pending:', pool.pending );
			console.log( 'max:', pool.max );
			console.log( 'min:', pool.min );
		};

		printPoolInfo();
		setInterval( printPoolInfo, 10000 );
	}
};
