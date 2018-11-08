#!/bin/bash

MD5="md5sum"
if [ -e /sbin/md5 ]; then
	MD5="/sbin/md5"
fi

# CSS
CSS_MD5="42da7ab7cfa26de33b97038742d42a9b"
CSS_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css' | $MD5)"

if [ "$CSS_MD5" = "$CSS_TEST_MD5" ]; then
	echo "CSS: Passed"
else
	echo "CSS: FAILED"
fi

# HTML
HTML_MD5="d3c127c4d9e792aa498f9f57620cd230"
HTML_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://wordpress.com/wp-content/themes/pub/vermilion-christmas/README.html' | $MD5)"

if [ "$HTML_MD5" = "$HTML_TEST_MD5" ]; then
	echo "HTML: Passed"
else
	echo "HTML: FAILED"
fi

# JS
JS_MD5="f4914d3c444df19755fa37e2ec788f83"
JS_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js' | $MD5)"

if [ "$JS_MD5" = "$JS_TEST_MD5" ]; then
	echo "JavaScript: Passed"
else
	echo "JavaScript: FAILED"
fi

# SVG
SVG_MD5="b90876922b20c6f46af491bbd18877d7"
SVG_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/svg2009.svg' | $MD5)"

if [ "$SVG_MD5" = "$SVG_TEST_MD5" ]; then
	echo "SVG: Passed"
else
	echo "SVG: FAILED"
fi

# Pass Through
# JPG
PT_JPG_MD5="0ed0040986945fa462e92e34bb1998b3"
PT_JPG_TEST_MD5="$(curl -s 'http://localhost:4000/?url=https://upload.wikimedia.org/wikipedia/en/5/58/Penny_test.jpg' | $MD5)"

if [ "$PT_JPG_MD5" = "$PT_JPG_TEST_MD5" ]; then
	echo "Pass Through, JPG: Passed"
else
	echo "Pass Through, JPG: FAILED"
fi
