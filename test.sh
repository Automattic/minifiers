#!/bin/bash

MD5="md5sum"
if [ -e /sbin/md5 ]; then
	MD5="/sbin/md5"
fi

# CSS
CSS_MD5="34dd241ea842656245ff0a3d965cbf39"
CSS_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css' | $MD5)"

if [ "$CSS_MD5" = "$CSS_TEST_MD5" ]; then
	echo "CSS: Passed"
else
	echo "CSS: FAILED"
fi

# CSS compressed
CSS_COMPRESS_TEST_MD5="$(curl --compressed -s 'http://localhost:4000/?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css' | $MD5)"

if [ "$CSS_MD5" = "$CSS_COMPRESS_TEST_MD5" ]; then
	echo "CSS Compressed: Passed"
else
	echo "CSS Compressed: FAILED"
fi

# HTML
HTML_MD5="4606198307c9a55290d953ad06585ef1"
HTML_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://wordpress.com/wp-content/themes/pub/vermilion-christmas/README.html' | $MD5)"

if [ "$HTML_MD5" = "$HTML_TEST_MD5" ]; then
	echo "HTML: Passed"
else
	echo "HTML: FAILED"
fi

# HTML Compressed
HTML_COMPRESS_TEST_MD5="$(curl --compressed -s 'http://localhost:4000/?url=https://wordpress.com/wp-content/themes/pub/vermilion-christmas/README.html' | $MD5)"

if [ "$HTML_MD5" = "$HTML_COMPRESS_TEST_MD5" ]; then
	echo "HTML Compressed: Passed"
else
	echo "HTML Compressed: FAILED"
fi

# JS
JS_MD5="594c1e9b65695c0bf776ecf90331b132"
JS_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js' | $MD5)"

if [ "$JS_MD5" = "$JS_TEST_MD5" ]; then
	echo "JavaScript: Passed"
else
	echo "JavaScript: FAILED"
fi

# JS Compressed
JS_COMPRESS_TEST_MD5="$(curl --compressed -s 'http://localhost:4000/?url=https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js' | $MD5)"

if [ "$JS_MD5" = "$JS_COMPRESS_TEST_MD5" ]; then
	echo "JavaScript Compressed: Passed"
else
	echo "JavaScript Compressed: FAILED"
fi

# SVG
SVG_MD5="3c6f0b9920a98c2cf05c8ae4bb29c073"
SVG_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/svg2009.svg' | $MD5)"

if [ "$SVG_MD5" = "$SVG_TEST_MD5" ]; then
	echo "SVG: Passed"
else
	echo "SVG: FAILED"
fi

# SVG Compressed
SVG_COMPRESS_TEST_MD5="$(curl --compressed -s 'http://localhost:4000/?url=https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/svg2009.svg' | $MD5)"

if [ "$SVG_MD5" = "$SVG_COMPRESS_TEST_MD5" ]; then
	echo "SVG Compressed: Passed"
else
	echo "SVG Compressed: FAILED"
fi

# Pass Through
# JPG
PT_JPG_MD5="809fd2c9401a2abf4e6fe220df8205af"
PT_JPG_TEST_MD5="$(curl -s 'http://localhost:4000/?url=http://imagecompression.info/test_images/big_thumbnails/big_building.jpg' | $MD5)"

if [ "$PT_JPG_MD5" = "$PT_JPG_TEST_MD5" ]; then
	echo "Pass Through, JPG: Passed"
else
	echo "Pass Through, JPG: FAILED"
fi
