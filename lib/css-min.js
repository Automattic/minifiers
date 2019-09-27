module.exports = ( body ) => {
	const csso = require( 'csso' );
	return Promise.resolve( csso.minify( body ).css );
};
