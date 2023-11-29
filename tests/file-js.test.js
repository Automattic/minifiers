'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const target_url = 'tests/files/example.js';
const vm = require( 'vm' );
const fs = require( 'fs' ).promises;

describe( 'file (js): Minify and execute minified code', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/file` -- JS minify', async () => {
		const originalContent = await fs.readFile( './tests/files/example.js', 'utf8' );

		const resp = await request
			.get( `/file?path=${ target_url }` )
			.expect( 200 )
			.expect( 'Content-Type', /application\/javascript/ )
			.expect( 'x-minify', 't' );
		const { text: minifiedText } = resp;

		// Verify it was actually minified
		const originalSize = originalContent.length;
		const minifiedSize = minifiedText.length;
		expect( minifiedSize ).toBeLessThan( originalSize * 0.65 );
		console.info(
			`Minimized to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed( 2 ) }% of original size`,
		);

		// Run the minified code returned from the response
		const sandbox = { window: {}, setTimeout, clearTimeout };
		vm.createContext( sandbox );
		vm.runInContext( minifiedText, sandbox );

		// Verify the results
		expect( sandbox.window.ClosureScopeTest() ).toBe( 'Hello World' );

		expect( sandbox.window.ObjectMethodTest.getSecret() ).toBe( 'hidden' );
		sandbox.window.ObjectMethodTest.setSecret( 'new secret' );
		expect( sandbox.window.ObjectMethodTest.getSecret() ).toBe( 'new secret' );

		const testFunction = ( a, b ) => a + b;
		expect( sandbox.window.HigherOrderFunctionTest( testFunction ) ).toBe( 15 );

		await new Promise( ( resolve ) => {
			sandbox.window.AsyncFunctionTest( ( response ) => {
				expect( response ).toBe( 'Async response' );
				resolve();
			} );
		} );

		expect( sandbox.window.VariableScopeTest() ).toBe( 20 );
		expect( sandbox.window.HoistingTest() ).toBe( 'hoisted' );
		expect( sandbox.window.ArrowFunctionTest() ).toBe( 'arrow function' );
		expect( sandbox.window.ConditionalTest( true ) ).toBe( 'truthy' );
		expect( sandbox.window.ConditionalTest( false ) ).toBe( 'falsy' );
		expect( sandbox.window.ErrorHandlingTest() ).toBe( 'caught' );
		expect( sandbox.window.LoopTest() ).toBe( 10 );
	} );
} );
