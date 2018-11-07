module.exports = ( msg_obj ) => {
	const time_stamp = new Date();

	msg_obj.log_time_stamp = time_stamp.toISOString();
	console.log( JSON.stringify( msg_obj ) );;
};
