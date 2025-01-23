module.exports = ( body ) => {
	const esbuild = require( 'esbuild' );
	return esbuild.transformSync( body, { loader: 'css', minify: true } ).code;
};
