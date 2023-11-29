'use strict';

const { getSharedServerPort } = require( './test-server-utils' );
const supertest = require( 'supertest' );
const vm = require( 'vm' );
const fs = require( 'fs' ).promises;

describe( 'file (js): Minify and execute minified code', () => {
	let request = supertest( `http://localhost:${ getSharedServerPort() }` );

	test( 'GET `/file` -- JS minify and execute example.js', async () => {
		const target_url = 'tests/files/example.js';
		const originalContent = await fs.readFile( target_url, 'utf8' );

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
			`Minimized ${ target_url } to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
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

	test( 'GET `/file` -- JS minify and execute lodash.js', async () => {
		const target_url = 'tests/files/lodash.4.17.15.js';
		const originalContent = await fs.readFile( target_url, 'utf8' );

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
			`Minimized ${ target_url } to ${ ( ( minifiedSize / originalSize ) * 100 ).toFixed(
				2,
			) }% of original size`,
		);

		// Run the minified code returned from the response
		const sandbox = { _: {} };
		vm.createContext( sandbox );
		vm.runInContext( minifiedText, sandbox );

		// Verify the results
		expect( sandbox._.add( 6, 4 ) ).toBe( 10 );
		expect( sandbox._.subtract( 10, 5 ) ).toBe( 5 );
		expect( sandbox._.multiply( 3, 4 ) ).toBe( 12 );
		expect( sandbox._.divide( 8, 2 ) ).toBe( 4 );

		expect( sandbox._.compact( [ 0, 1, false, 2, '', 3 ] ) ).toEqual( [ 1, 2, 3 ] );
		expect( sandbox._.concat( [ 1 ], 2, [ 3 ], [ [ 4 ] ] ) ).toEqual( [ 1, 2, 3, [ 4 ] ] );
		expect( sandbox._.difference( [ 2, 1 ], [ 2, 3 ] ) ).toEqual( [ 1 ] );

		expect( sandbox._.assign( { a: 0 }, { a: 1, b: 2 } ) ).toEqual( { a: 1, b: 2 } );
		expect( sandbox._.keys( { a: 1, b: 2, c: 3 } ) ).toEqual( [ 'a', 'b', 'c' ] );
		expect( sandbox._.values( { a: 1, b: 2, c: 3 } ) ).toEqual( [ 1, 2, 3 ] );

		expect( sandbox._.find( [ 1, 2, 3, 4 ], ( num ) => num % 2 == 0 ) ).toBe( 2 );
		expect( sandbox._.filter( [ 1, 2, 3, 4 ], ( num ) => num % 2 == 0 ) ).toEqual( [ 2, 4 ] );

		expect( sandbox._.capitalize( 'lodash' ) ).toBe( 'Lodash' );
		expect( sandbox._.endsWith( 'abc', 'c' ) ).toBe( true );

		expect( sandbox._.random( 1, 5 ) ).toBeGreaterThanOrEqual( 1 );
		expect( sandbox._.random( 1, 5 ) ).toBeLessThanOrEqual( 5 );
		expect( sandbox._.uniqueId( 'prefix-' ) ).toContain( 'prefix-' );
	} );
} );
