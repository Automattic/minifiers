'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url =
	'https://wp-themes.com/wp-content/themes/twentytwentytwo/assets/images/flight-path-on-transparent-d.png';

describe( 'get-pass-through-test: Default environment', () => {
	let server;
	let request;

	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/get` -- Pass Through', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /image\/png/ );
	} );
} );
