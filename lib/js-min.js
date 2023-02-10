module.exports = ( body ) => {
	const swc = require( '@swc/core' );
	const result = swc.minifySync( body, {
		compress: false,
		mangle: true,
	} );

	return result.code;
};
