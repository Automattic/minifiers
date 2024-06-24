const svgMin = require( '../lib/svg-min.js' );

describe( 'SVG Minification', () => {
	const sampleSvg = `
	<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
		<circle cx="50" cy="50" r="40" fill="red" />
		<rect x="20" y="20" width="60" height="60" fill="blue" opacity="0.5" />
	</svg>
  `;

	test( 'SVG is minified and smaller in size', () => {
		const minified = svgMin( sampleSvg );
		expect( minified.length ).toBeLessThan( sampleSvg.length );
	} );

	test( 'Minified SVG is still valid', () => {
		const minified = svgMin( sampleSvg );
		expect( minified ).toMatch( /^<svg[^>]*>/ );
		expect( minified ).toMatch( /<\/svg>$/ );
	} );

	test( 'SVG core attributes are preserved', () => {
		const minified = svgMin( sampleSvg );
		expect( minified ).toContain( 'width="100"' );
		expect( minified ).toContain( 'height="100"' );
	} );

	test( 'Complex SVG is handled correctly', () => {
		const complexSvg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
			<defs>
				<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
					<stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
				</linearGradient>
			</defs>
			<ellipse cx="100" cy="70" rx="85" ry="55" fill="url(#grad)" />
			<text fill="#ffffff" font-size="45" font-family="Verdana" x="50" y="86">SVG</text>
		</svg>
	`;
		const minified = svgMin( complexSvg );
		expect( minified ).toContain( 'linearGradient' );
		expect( minified ).toContain( 'ellipse' );
		expect( minified ).toContain( 'text' );
	} );

	test( 'SVG with styles is minified correctly', () => {
		const svgWithStyles = `
		<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
			<style>
				.test { fill: blue; }
			</style>
			<circle class="test" cx="50" cy="50" r="40" />
		</svg>
	`;
		const minified = svgMin( svgWithStyles );
		expect( minified ).toContain( 'fill:#00f' );
	} );

	test( 'Minification removes unnecessary whitespace', () => {
		const minified = svgMin( sampleSvg );
		expect( minified ).not.toContain( '\n' );
		expect( minified ).not.toMatch( />\s+</ );
	} );

	test( 'Error handling for invalid SVG', () => {
		const invalidSvg = '<svg><unclosed-tag></svg>';
		expect( () => svgMin( invalidSvg ) ).toThrow();
	} );

	test( 'Minification maintains basic SVG structure', () => {
		const minified = svgMin( sampleSvg );
		expect( minified ).toContain( '<circle' );
		expect( minified ).toContain( '<path' ); // assuming rect is converted to path
	} );
} );
