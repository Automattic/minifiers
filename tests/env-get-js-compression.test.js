'use strict';

const { startServer, stopServer, getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js';

const expectCompressedSizeJquery = ( headers ) => {
	const length = parseInt( headers[ 'content-length' ] );
	expect( length ).toBeGreaterThanOrEqual( 20000 );
	expect( length ).toBeLessThanOrEqual( 40000 );
};

const expectUncompressedSizeJquery = ( headers ) => {
	const length = parseInt( headers[ 'content-length' ] );
	expect( length ).toBeGreaterThanOrEqual( 80000 );
	expect( length ).toBeLessThanOrEqual( 100000 );
};

describe( 'env-get-js-compression: MINIFIERS_DISABLE_COMPRESSION=1 in env', () => {
	let server;
	let request;

	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {
			MINIFIERS_DISABLE_COMPRESSION: '1',
			MINIFIERS_MIN_CHILD_PROCESSES: '0',
		} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/get` -- MINIFIERS_DISABLE_COMPRESSION=1, param', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( ( res ) => expect( res.headers[ 'content-encoding' ] ).toBeUndefined() )
			.expect( ( res ) => expect( res.headers[ 'x-minify-compression-level' ] ).toBeUndefined() )
			.expect( ( res ) => expectUncompressedSizeJquery( res.headers ) );
	} );

	test( 'GET `/get` -- MINIFIERS_DISABLE_COMPRESSION=1, no param', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( ( res ) => expect( res.headers[ 'content-encoding' ] ).toBeUndefined() )
			.expect( ( res ) => expect( res.headers[ 'x-minify-compression-level' ] ).toBeUndefined() )
			.expect( ( res ) => expectUncompressedSizeJquery( res.headers ) );
	} );
} );

describe( 'env-get-js-compression: MINIFIERS_DISABLE_COMPRESSION=0 in env', () => {
	let server;
	let request;

	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {
			MINIFIERS_DISABLE_COMPRESSION: '0',
			MINIFIERS_MIN_CHILD_PROCESSES: '0',
		} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/get` -- MINIFIERS_DISABLE_COMPRESSION=0, param', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( ( res ) => expectCompressedSizeJquery( res.headers ) );
	} );

	test( 'GET `/get` -- MINIFIERS_DISABLE_COMPRESSION=0, no param', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( ( res ) => expectCompressedSizeJquery( res.headers ) );
	} );
} );

describe( 'env-get-js-compression: Default Environment', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/get` -- compression on in default env', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'content-encoding', 'gzip' )
			.expect( ( res ) => expectCompressedSizeJquery( res.headers ) );
	} );

	test( 'GET `/get` -- Accept-Encoding identity', async () => {
		// Covers a bug when sending Accept-Encoding: identity caused compressed data to be sent.
		// Here, we expect to see uncompressed data.
		const resp = await request
			.get( `/get?url=${ target_url }` )
			.set( 'Accept-Encoding', 'identity' )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( ( res ) => expect( res.headers[ 'content-encoding' ] ).toBeUndefined() )
			.expect( ( res ) => expect( res.headers[ 'x-minify-compression-level' ] ).toBeUndefined() )
			.expect( ( res ) => expectUncompressedSizeJquery( res.headers ) );
	} );
} );
