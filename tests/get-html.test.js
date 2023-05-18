'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://wordpress.com/wp-content/themes/pub/vermilion-christmas/README.html';

describe( 'get-html: Default environment', () => {
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

	test( 'GET `/get` -- HTML', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/html/ )
			.expect( /Vermillion Christmas 1.0/ );
	} );

	test( 'GET `/get` -- HTML & gzip level 9', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/html/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( 'x-minify-compression-level', '9' );
	} );

	test( 'GET `/get` -- HTML & br level 11', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=br&level=11` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/html/ )
			.expect( 'content-encoding', 'br' )
			.expect( 'x-minify-compression-level', '11' );
	} );

	test( 'GET `/get` -- HTML & deflate level 8', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=deflate&level=8` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/html/ )
			.expect( 'content-encoding', 'deflate' )
			.expect( 'x-minify-compression-level', '8' );
	} );
} );
