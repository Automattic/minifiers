'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/svg2009.svg';

describe( 'get-svg: Default environment', () => {
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

	test( 'GET `/get` -- SVG', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /image\/svg\+xml/ );
	} );

	test( 'GET `/get` -- SVG & gzip level 9', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /image\/svg\+xml/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( 'x-minify-compression-level', '9' );
	} );

	test( 'GET `/get` -- SVG & br level 11', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=br&level=11` )
			.expect( 200 )
			.expect( 'Content-Type', /image\/svg\+xml/ )
			.expect( 'content-encoding', 'br' )
			.expect( 'x-minify-compression-level', '11' );
	} );

	test( 'GET `/get` -- SVG & deflate level 8', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=deflate&level=8` )
			.expect( 200 )
			.expect( 'Content-Type', /image\/svg\+xml/ )
			.expect( 'content-encoding', 'deflate' )
			.expect( 'x-minify-compression-level', '8' );
	} );
} );
