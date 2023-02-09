module.exports = ( body ) => {
	const jsonminify = require("jsonminify");
	return jsonminify( body );
};
