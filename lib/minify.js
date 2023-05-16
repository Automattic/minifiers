module.exports = async ( body, type ) => {
	const config = require( '../config' )();

	for ( let t in config ) {
		if ( config[ t ].regex.test( type ) ) {
			let result = await config[ t ].min_func( body );
			return [ result, t ];
		}
	}

	// If we are still here, nothing to minify
	return [ body, false ];
};
