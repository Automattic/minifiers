'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const fs = require( 'fs' ).promises;

describe( 'file (css): Minify CSS files', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/file` -- CSS minify bootstrap.css', async () => {
		const target_url = 'tests/files/bootstrap.css';
		const originalContent = await fs.readFile( target_url, 'utf8' );

		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' );

		const minifiedText = resp.text;

		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.85 );
		console.info(
			`Minimized CSS ${ target_url } to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
		);
	} );

	test( 'GET `/file` -- CSS minify supports nesting :where(& > .bar)', async () => {
		// This is from https://github.com/evanw/esbuild/issues/4005
		const target_url = 'tests/files/nesting-test.css';
		const originalContent = await fs.readFile( target_url, 'utf8' );

		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' );

		const minifiedText = resp.text;
		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.85 );

		// Verify the "purple" rule was not removed
		expect( minifiedText ).toContain( 'purple' );

		console.info(
			`Minimized CSS ${ target_url } to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
		);
	} );
} );
