module.exports = ( request, reply ) => {
	const superagent = require( 'superagent' );
	const compress = require( '../lib/compress' );

	// Info we have been provided
	const url = request.query.url;

	let accept = request.headers['accept-encoding'];
	if ( typeof request.query.with === 'string' ) {
		accept = request.query.with;
	}

	let level = 1;
	if ( typeof request.query.level === 'string' ) {
		level = parseInt( request.query.level );
	}

	// Go get the original
	superagent
		.get( url )
		.then( resp => send_reply( reply, resp, accept, level ) )
		.catch( err => send_error( reply, err ) )
	;

	function send_reply( reply, resp, accept, level ) {
		let encoding = '';

		let body = minify( resp.text, resp.header['content-type'] );
		[ body, encoding ] = compress( resp.text, accept, level );

		reply
			.code( 200 )
			.header( 'Content-Type', resp.headers['content-type'] )
			.header( 'Content-Encoding', encoding )
			.header( 'x-compression-level', level )
			.send( body )
		;
	}

	function minify( body, type ) {
		return body;
	}

	function send_error( reply, err ) {
		reply
			.code( 500 )
			.header( 'Content-Type', 'application/json' )
			.header( 'x-error-code', 10000 )
			.send( {
				status: 'error',
				code: 10000,
				msg: 'Error requesting the original resource'
			} )
		;
	}
};
