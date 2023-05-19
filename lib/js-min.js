// This version runs in-line, but we found that swc has a memory leak (or unbounded cache).
// For an alternative, see: ./lib/processes/js-min-parent.js, which
// runs the minification in a child process.

module.exports = ( body ) => {
	const swc = require( '@swc/core' );
	const result = swc.minifySync( body, {
		compress: false,
		mangle: true,
	} );

	return result.code;
};
