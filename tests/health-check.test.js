'use strict';

const supertest = require( 'supertest' );

test( 'GET `/health-check` route', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( '/health-check' )
		.expect( 200 )
		.expect( 'Content-Type', 'application/json; charset=utf-8' )
		.expect( { status: 'OK' } );
} );
