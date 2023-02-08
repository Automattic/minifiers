"use strict";

const supertest = require( 'supertest' );

test( 'GET `/get` -- CSS', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( '/get?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css' )
		.expect( 200 )
		.expect( 'Content-Type', /text\/css/ )
		.expect( /Bootstrap v4.1.3/ )
	;
} );

test( 'GET `/get` -- CSS & gzip level 9', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( '/get?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css&with=gzip&level=9' )
		.expect( 200 )
		.expect( 'Content-Type', /text\/css/ )
		.expect( 'content-encoding', 'gzip' )
		.expect( 'x-compression-level', '9' )
		.expect( /Bootstrap v4.1.3/ )
	;
} );
