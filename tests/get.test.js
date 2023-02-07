"use strict";

const supertest = require( 'supertest' );

test( 'GET `/get` -- CSS', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( '/get' )
		.expect( 200 )
		.expect('Content-Type', 'text/css')
		.expect( { status: "OK" } )
	;
} );
