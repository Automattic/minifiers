'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );

describe( 'health-check: Default environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );
	test( 'GET `/health-check` route', async () => {
		const resp = await request
			.get( '/health-check' )
			.expect( 200 )
			.expect( 'Content-Type', 'application/json; charset=utf-8' )
			.expect( { status: 'OK' } );
	} );
} );
