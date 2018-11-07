module.exports = ( body ) => {
	const svgo = require( 'svgo' );
	const svg = new svgo( {} );
	return svg.optimize( body ).then( result => result.data );
};
