module.exports = ( body ) => {
	const csso = require( 'csso' );
	return csso.minify( body, { restructure: false } ).css;
};
