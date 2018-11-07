module.exports = ( body ) => {
	const terser = require( 'terser' );

	const result = terser.minify( body, {
		compress: true,
		mangle: true
	} );

	return result['code'];
};
