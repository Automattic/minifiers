"use strict";

const supertest = require( 'supertest' );
const target_url = 'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css';

test( 'GET `/get` -- No Minify', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/get?minify=false&url=${target_url}` )
		.expect( 200 )
		.expect( 'Content-Type', /text\/css/ )
		.expect( 'x-minify', 'f' )
		.expect( /Bootstrap v4.1.3/ )
	;
} );
