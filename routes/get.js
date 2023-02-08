module.exports = ( request, reply ) => {
	const superagent = require( 'superagent' );

	let compression_level = 1;

	// Info we have been provided
	const url = request.query.url;

	// Go get the original
	superagent
		.get( url )
		.then( resp => send_reply( reply, resp, compression_level ) )
		.catch( err => send_error( reply, err ) )
	;

	function send_reply( reply, resp, compression_level ) {
		let body = minify( resp.text, resp.header['content-type'] );
		body = compress( resp.text, 'gzip', compression_level );

		reply
			.code( 200 )
			.header( 'Content-Type', resp.headers['content-type'] )
			.header( 'x-compression-level', compression_level )
			.send( body )
		;
	}

	function send_error( reply, err ) {
		reply
			.code( 500 )
			.header( 'Content-Type', 'application/json' )
			.send( {
				status: 'error',
				code: 10000,
				msg: 'Error requesting the original resource'
			} )
		;
	}

	function minify( body, type ) {
		return body;
	}

	function compress( body, compress_as, compression_level ) {
		return body;
	}
};
