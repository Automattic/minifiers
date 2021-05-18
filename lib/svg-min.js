module.exports = ( body ) => {
	const svgo = require( 'svgo' );
	return svgo.optimize( body ).data;
};
