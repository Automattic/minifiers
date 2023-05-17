const path = require( 'path' );
const defaultBasePath = path.dirname( __dirname );

// Allow a path, but only if it falls under the base path after resolving.
//
// The base path can be set with the MINIFIERS_BASE_PATH environment variable.
// If not set, it defaults to the minifiers directory.
module.exports = ( userPath ) => {
	const normalizedUserPath = path.normalize( userPath );

	const basePath = path.resolve( process.env.MINIFIERS_BASE_PATH || defaultBasePath );
	const resolvedPath = path.resolve( basePath, normalizedUserPath );

	if ( resolvedPath.startsWith( basePath + path.sep ) ) {
		return resolvedPath;
	}
	return false;
};
