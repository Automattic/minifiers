'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url =
	'https://wp-themes.com/wp-content/themes/twentytwentytwo/assets/images/flight-path-on-transparent-d.png';

describe( 'get-pass-through-test: Default environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/get` -- Pass Through', async () => {
		try {
			const resp = await request
				.get( `/get?url=${ target_url }` )
				.expect( 200 )
				.expect( 'Content-Type', /image\/png/ );
		} catch ( error ) {
			console.error( 'Test failed with error:', error );
			console.error( 'Response body:', error.response.body );
			console.error( 'Response headers:', error.response.headers );
			throw error;
		}
	} );
} );
