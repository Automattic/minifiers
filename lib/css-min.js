module.exports = ( body ) => {
	const CleanCSS = require( 'clean-css' );
	const options = {
		/* options */
	};
	return new CleanCSS().minify( body ).styles;
};
