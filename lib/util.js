const envBool = (envVar) => {
	const val = process.env[envVar];
	if (val === undefined) {
		return false;
	}
	if (val === '' || val === '0' || val === 'false') {
		return false;
	}
	return true;
};
module.exports = { envBool };
