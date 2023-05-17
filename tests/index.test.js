'use strict';

const supertest = require( 'supertest' );

test( 'GET `/` route', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( '/' )
		.expect( 200 )
		.expect( 'Content-Type', 'text/plain' )
		.expect( 'Minifiers' );
} );
