"use strict";

const supertest = require( 'supertest' );
const target_url = 'tests/bootstrap.css';

test( 'GET `/file` -- No Minify', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/file?path=${target_url}` )
		.expect( 200 )
		.expect( 'Content-Type', /text\/css/ )
		.expect( 'x-minify', 't' )
		.expect( /Bootstrap v4.1.3/ )
	;
} );
