'use strict';

const supertest = require( 'supertest' );
const target_url = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js';

test( 'GET `/get` -- JS', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/get?url=${ target_url }` )
		.expect( 200 )
		.expect( 'Content-Type', /application\/javascript/ )
		.expect( /jquery.com/ );
} );

test( 'GET `/get` -- JS & gzip level 9', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/get?url=${ target_url }&with=gzip&level=9` )
		.expect( 200 )
		.expect( 'Content-Type', /application\/javascript/ )
		.expect( 'content-encoding', 'gzip' )
		.expect( 'x-minify-compression-level', '9' );
} );

test( 'GET `/get` -- JS & br level 11', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/get?url=${ target_url }&with=br&level=11` )
		.expect( 200 )
		.expect( 'Content-Type', /application\/javascript/ )
		.expect( 'content-encoding', 'br' )
		.expect( 'x-minify-compression-level', '11' );
} );

test( 'GET `/get` -- JS & deflate level 8', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/get?url=${ target_url }&with=deflate&level=8` )
		.expect( 200 )
		.expect( 'Content-Type', /application\/javascript/ )
		.expect( 'content-encoding', 'deflate' )
		.expect( 'x-minify-compression-level', '8' );
} );
