module.exports = () => {
	return {
		css: {
			regex: new RegExp( /^text\/css/ ),
			min_func: require( './lib/css-min.js' ),
			type: 'string',
		},
		html: {
			regex: new RegExp( /^text\/html/ ),
			min_func: require( './lib/html-min.js' ),
			type: 'string',
		},
		js: {
			regex: new RegExp(
				/^(application\/javascript)|(application\/x-javascript)|(application\/ecmascript)|(text\/javascript)|(text\/ecmascript)/
			),
			min_func: require( './lib/processes/js-min-parent.js' ), // Forking version
			// min_func: require( './lib/js-min.js' ), // Non-forking version
			type: 'string',
		},
		json: {
			regex: new RegExp( /^(application\/json)/ ),
			min_func: require( './lib/json-min.js' ),
			type: 'string',
		},
		svg: {
			regex: new RegExp( /^image\/svg\+xml/ ),
			min_func: require( './lib/svg-min.js' ),
			type: 'string',
		},
	};
};
