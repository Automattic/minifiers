'use strict';

const { startServer, stopServer } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js';

describe( 'get-js-no-compression: MINIFIERS_DISABLE_COMPRESSION=1 in env', () => {
	let server;
	let request;

	beforeAll( async () => {
		const { server: serverInstance, port } = await startServer( {
			MINIFIERS_DISABLE_COMPRESSION: '1',
			MINIFIERS_MIN_CHILD_PROCESSES: '1',
		} );
		server = serverInstance;
		request = supertest( `http://localhost:${ port }` );
	} );

	afterAll( () => {
		return stopServer( server );
	} );

	test( 'GET `/get` -- MINIFIERS_DISABLE_COMPRESSION prevents gzip even when given parameter', async () => {
		const resp = await request
			.get( `/get?url=${ target_url }&with=gzip&level=9` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( ( res ) => expect( res.headers[ 'content-encoding' ] ).toBeUndefined() )
			.expect( ( res ) => expect( res.headers[ 'x-minify-compression-level' ] ).toBeUndefined() );
	} );
} );
