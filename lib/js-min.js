module.exports = ( body ) => {
	const terser = require( 'terser' );

	const result = terser.minify( body, {
		compress: true,
		mangle: true
	} );

	return Promise.resolve( result['code'] );
};
