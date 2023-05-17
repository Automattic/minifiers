'use strict';

const supertest = require( 'supertest' );
const target_url =
	'https://wp-themes.com/wp-content/themes/twentytwentytwo/assets/images/flight-path-on-transparent-d.png';

test( 'GET `/get` -- Pass Through', async () => {
	const resp = await supertest( 'http://localhost:4747' )
		.get( `/get?url=${ target_url }` )
		.expect( 200 )
		.expect( 'Content-Type', /image\/png/ );
} );
