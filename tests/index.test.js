'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );

describe( 'index: Default environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/` route', async () => {
		const resp = await request
			.get( '/' )
			.expect( 200 )
			.expect( 'Content-Type', 'text/plain' )
			.expect( 'Minifiers' );
	} );
} );
