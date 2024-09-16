'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js';

describe( 'get-js: Default environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/get` -- JS', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( /jquery.com/ );
	} );

	test( 'GET `/get` -- JS & gzip level 9', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( 'x-minify-compression-level', '9' );
	} );

	test( 'GET `/get` -- JS & br level 11', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=br&level=11` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'content-encoding', 'br' )
			.expect( 'x-minify-compression-level', '11' );
	} );

	test( 'GET `/get` -- JS & deflate level 8', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=deflate&level=8` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'content-encoding', 'deflate' )
			.expect( 'x-minify-compression-level', '8' );
	} );

	test( 'GET `/get` -- JS & verify minification', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'x-minify', 't' );

		const { text: minifiedText } = resp;

		// Fetch the original content
		const originalResp = await supertest( target_url ).get( '' );
		const originalContent = originalResp.text;

		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.65 );
		console.info(
			`Minimized jQuery to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
		);
	} );
} );
