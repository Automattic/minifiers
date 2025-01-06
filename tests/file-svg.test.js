'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const fs = require( 'fs' ).promises;

describe( 'file (js): Minify and execute minified code', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/file` -- SVG minify svg2009.svg', async () => {
		const target_url = 'tests/files/svg2009.svg';
		const originalContent = await fs.readFile( target_url, 'utf8' );

		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /image\/svg\+xml/ )
			.expect( 'x-minify', 't' );

		const minifiedText = resp.body.toString( 'utf8' );

		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.65 );
		console.info(
			`Minimized ${ target_url } to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
		);
	} );
} );
