'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );

// Example “CSS Concat” URL with double question marks.
// Also has "&cssminify=yes" so we test the server's logic for removing that.
const concatUrl =
	'https://automattic.com/_static/??-eJx9j8sOAiEMRX/I2owmDhvjtzClIgYo4TH+vqhxoht296bnJLfoMEp1JLFsYU+l7PCRoJfKsWJokHyz7sNwQW2Ci7DoDOthRGdevNgeLXbqp44kywJeSFcn8a/A1WuXR6pWBFXE92VYWuIM29Kh9oX6nSSA4aXZ93uBA2m6sXnpl3Ce5qNSp1lN6v4EdUpz2w==&cssminify=yes';

describe( 'raw-get-css: Default environment', () => {
	// Create a supertest instance pointing to our local server
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/raw-get/` -- CSS Concat URL with cssminify=yes', async () => {
		// We build the path by simply appending the entire concatUrl after '/raw-get/'.
		// We do NOT URL-encode the double question marks, to confirm our “raw-get” logic works.
		const rawPath = '/raw-get/' + concatUrl;

		const resp = await request
			.get( rawPath )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' ); // because we expect minification to be active

		// Confirm it returned *some* CSS.
		expect( resp.text ).toMatch( /body|html/ );
	} );
} );
