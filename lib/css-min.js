module.exports = async (body) => {
	const postcss = require( 'postcss' );
	const cssnano = require( 'cssnano' );

	try {
		const result = await postcss( [ cssnano ] )
			.process( body, { from: undefined } ) // Add `from` option to avoid warnings, telling PostCSS this doesn't come from a file
			.then( result => result.css );
		return result;
	} catch ( error ) {
		console.error( 'PostCSS processing error:', error );
		throw error;
	}
};
