'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://wordpress.com/wp-content/themes/pub/vermilion-christmas/README.html';

describe( 'get-html: Default environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

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

	test( 'GET `/get` -- HTML & verify minification', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/html/ )
			.expect( 'x-minify', 't' );

		const { text: minifiedText } = resp;

		// Fetch the original content
		const originalResp = await supertest( target_url ).get( '' );
		const originalContent = originalResp.text;

		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.93 );
		console.info(
			`Minimized HTML to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
		);
	} );
} );
