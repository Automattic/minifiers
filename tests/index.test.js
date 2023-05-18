'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );

describe( 'index: Default environment', () => {
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

	test( 'GET `/` route', async () => {
		const resp = await request
			.get( '/' )
			.expect( 200 )
			.expect( 'Content-Type', 'text/plain' )
			.expect( 'Minifiers' );
	} );
} );
