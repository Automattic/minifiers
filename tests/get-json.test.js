'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://s0.wp.com/wp-content/themes/pub/twentytwentytwo/theme.json';

describe( 'get-json: Default environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/get` -- JSON', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/json/ )
			.expect( /customTemplates/ );
	} );

	test( 'GET `/get` -- JSON & gzip level 9', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/json/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( 'x-minify-compression-level', '9' );
	} );

	test( 'GET `/get` -- JSON & br level 11', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=br&level=11` )
			.expect( 200 )
			// Supertest / Superagent tries to parse JSON, but does not
			// understand brotli compression, so set a separate parser
			// that does not care about JSON.
			.buffer( true )
			.parse( ( res, cb ) => {
				let data = Buffer.from( '' );
				res.on( 'data', ( chunk ) => {
					data = Buffer.concat( [ data, chunk ] );
				} );
				res.on( 'end', () => {
					cb( null, data.toString() );
				} );
			} )
			.expect( 'Content-Type', /application\/json/ )
			.expect( 'content-encoding', 'br' )
			.expect( 'x-minify-compression-level', '11' );
	} );

	test( 'GET `/get` -- JSON & deflate level 8', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=deflate&level=8` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/json/ )
			.expect( 'content-encoding', 'deflate' )
			.expect( 'x-minify-compression-level', '8' );
	} );
} );
