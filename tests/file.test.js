'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'tests/bootstrap.css';

describe( 'file: Default environment', () => {
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

	test( 'GET `/file` -- CSS minify', async () => {
		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' )
			.expect( /Bootstrap v4.1.3/ );
	} );

	test( 'GET `/file` -- 404 not found', async () => {
		const resp = await request.get( `/file?path=/this/is/not/real` ).expect( 404 );
	} );

	test( 'GET `/file` -- .dev no minify', async () => {
		const resp = await request
			.get( `/file?path=tests/bootstrap.dev.css` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 'f' )
			.expect( /Bootstrap v4.1.3/ );
	} );

	test( 'GET `/file` -- .min no minify', async () => {
		const resp = await request
			.get( `/file?path=tests/bootstrap.min.css` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 'f' )
			.expect( /Bootstrap v4.1.3/ );
	} );
} );
