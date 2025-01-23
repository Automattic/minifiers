module.exports = ( body ) => {
	const { transform } = require( 'lightningcss' );
	const { code } = transform( {
		code: Buffer.from( body ),
		minify: true,
	} );
	return code.toString();
};
