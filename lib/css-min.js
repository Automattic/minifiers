module.exports = ( body ) => {
	const unicodePattern = /\\[0-9a-fA-F]{1,6}/;

	// If Unicode escape sequence is found, return original CSS
	if ( unicodePattern.test( body ) ) {
		return body;
	}

	const csso = require( 'csso' );
	return csso.minify( body, { restructure: false } ).css;
};
