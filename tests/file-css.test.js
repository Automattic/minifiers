'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const fs = require( 'fs' ).promises;

describe( 'file (css): Minify CSS files', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/file` -- CSS minify bootstrap.css', async () => {
		const target_url = 'tests/files/bootstrap.css';
		const originalContent = await fs.readFile( target_url, 'utf8' );

		const startTime = process.hrtime();
		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' );
		const [ seconds, nanoseconds ] = process.hrtime( startTime );
		const milliseconds = seconds * 1000 + nanoseconds / 1000000;

		const minifiedText = resp.text;

		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.85 );
		console.info(
			`Minimized CSS ${ target_url } to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size in ${ milliseconds.toFixed( 2 ) }ms`,
		);
	} );

	test( 'GET `/file` -- CSS preserves Unicode escape sequences', async () => {
		const target_url = 'tests/files/test-unicode.css';
		const originalContent = await fs.readFile( target_url, 'utf8' );

		const startTime = process.hrtime();
		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /text\/css/ )
			.expect( 'x-minify', 't' );
		const [ seconds, nanoseconds ] = process.hrtime( startTime );
		const milliseconds = seconds * 1000 + nanoseconds / 1000000;

		const minifiedText = resp.text;

		// Verify Unicode escape sequence is preserved
		expect( minifiedText ).toContain( '"\\f148"' );

		// expect( minifiedText.length ).toBeLessThan( originalContent.length ); // Do not verify for now
		console.info(
			`Minimized CSS ${ target_url } to ${ (
				( minifiedText.length / originalContent.length ) *
				100
			).toFixed( 2 ) }% of original size in ${ milliseconds.toFixed( 2 ) }ms`,
		);
	} );
} );
