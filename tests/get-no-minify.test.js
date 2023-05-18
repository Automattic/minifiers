'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css';

describe( 'get-no-minify: Default environment', () => {
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

	test( 'GET `/get` -- No Minify', async () => {
		const resp = await request
			.get( `/get?minify=false&url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 'f' )
			.expect( /Bootstrap v4.1.3/ );
	} );
} );
