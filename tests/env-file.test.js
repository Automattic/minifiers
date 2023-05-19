'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'bootstrap.css';

describe( 'env-file: MINIFIERS_BASE_PATH valid', () => {
	let server;
	let request;

	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {
			MINIFIERS_BASE_PATH: __dirname,
			MINIFIERS_MIN_CHILD_PROCESSES: '0',
		} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/file` -- CSS minify with valid base path', async () => {
		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' )
			.expect( /Bootstrap v4.1.3/ );
	} );
} );

describe( 'env-file: MINIFIERS_BASE_PATH invalid', () => {
	let server;
	let request;
	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {
			MINIFIERS_BASE_PATH: '/this/is/an/invalid/path',
			MINIFIERS_MIN_CHILD_PROCESSES: '0',
		} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/file` -- 404 not found with invalid base path', async () => {
		const resp = await request.get( `/file?path=${ target_url }` ).expect( 404 );
	} );
} );

describe( 'env-file: security tests', () => {
	let server;
	let request;

	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {
			MINIFIERS_BASE_PATH: __dirname,
			MINIFIERS_MIN_CHILD_PROCESSES: '0',
		} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/file` -- /etc/passwd should return 404', async () => {
		const resp = await request.get( `/file?path=/etc/passwd` ).expect( 404 );
	} );

	test( 'GET `/file` -- ../../../../../../etc/passwd should return 404', async () => {
		const resp = await request.get( `/file?path=../../../../../../etc/passwd` ).expect( 404 );
	} );

	test( 'GET `/file` -- URL encoded traversal should return 404', async () => {
		const resp = await request
			.get( `/file?path=%2E%2E%2F%2E%2E%2F%2E%2E%2F%2E%2E%2F%2E%2E%2Fetc%2Fpasswd` )
			.expect( 404 );
	} );

	test( 'GET `/file` -- Double URL encoded traversal should return 404', async () => {
		const resp = await request
			.get(
				`/file?path=%252E%252E%252F%252E%252E%252F%252E%252E%252F%252E%252E%252F%252E%252E%252Fetc%252Fpasswd`
			)
			.expect( 404 );
	} );

	test( 'GET `/file` -- UTF-8 encoded traversal should return 404', async () => {
		const resp = await request
			.get(
				`/file?path=%C0%AE%C0%AE%2F%C0%AE%C0%AE%2F%C0%AE%C0%AE%2F%C0%AE%C0%AE%2F%C0%AE%C0%AE%2Fetc%2Fpasswd`
			)
			.expect( 404 );
	} );
} );
