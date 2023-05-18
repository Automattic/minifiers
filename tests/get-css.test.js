'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css';

describe( 'get-css: Default environment', () => {
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

	test( 'GET `/get` -- CSS', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( /Bootstrap v4.1.3/ );
	} );

	test( 'OPTIONS `/get` -- CSS', async () => {
		const resp = await request
			.options( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( /Bootstrap v4.1.3/ );
	} );

	test( 'GET `/get` -- CSS & gzip level 9', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( 'x-minify-compression-level', '9' );
	} );

	test( 'GET `/get` -- CSS & br level 11', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=br&level=11` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'content-encoding', 'br' )
			.expect( 'x-minify-compression-level', '11' );
	} );

	test( 'GET `/get` -- CSS & deflate level 8', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=deflate&level=8` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'content-encoding', 'deflate' )
			.expect( 'x-minify-compression-level', '8' );
	} );
} );
