module.exports = ( request, response, url_parts, process_types ) => {
	response.writeHead( 200, { 'Content-Type': 'text/plain' } );
	response.end( 'OK' );
};
