module.exports = async ( body ) => {
	const html = require( 'html-minifier-terser' );
	const csso = require( 'csso' );

	const result = await html.minify( body, {
		collapseWhitespace: true,
		minifyJS: true,
		minifyCSS: function ( text, type ) {
			return csso.minify( text ).css;
		},
		removeComments: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		sortAttributes: true,
		sortClassName: true,
	} );

	return result;
};
