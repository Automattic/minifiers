module.exports = ( request, reply ) => {
	reply.code( 200 ).header( 'Content-Type', 'application/json' ).send( { status: 'OK' } );
};
