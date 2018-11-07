module.exports = (
	url,
	type,
	timings,
	original_size,
	minified_size,
	minify_time
) => {
	const log = require( './log.js' );

	const size_diff = original_size - minified_size;

	log( {
		'url': url,
		'type': type,
		'timing': timings,
		'original_size': original_size,
		'minified_size': minified_size,
		'minify_time': parseFloat( minify_time.toFixed( 3 ) ),
		'size_diff': size_diff,
		'size_diff_percent': parseFloat(
			( ( size_diff / original_size ) * 100 ).toFixed( 3 )
		)
	} );
};
