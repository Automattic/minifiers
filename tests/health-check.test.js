'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );

describe( 'health-check: Default environment', () => {
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

	test( 'GET `/health-check` route', async () => {
		const resp = await request
			.get( '/health-check' )
			.expect( 200 )
			.expect( 'Content-Type', 'application/json; charset=utf-8' )
			.expect( { status: 'OK' } );
	} );
} );
