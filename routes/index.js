module.exports = ( request, reply ) => {
	reply
		.code( 200 )
		.header( 'Content-Type', 'text/plain' )
		.send( 'Minifiers' )
	;
};
