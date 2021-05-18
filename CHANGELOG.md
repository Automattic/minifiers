# Changelog

## 7.0.0 : 18 May 2021
- Update 'csso' to 4.2.0
- Update 'got' to 11.8.2
- Update 'svgo' to 2.3.0
- Update 'terser' to 5.7.0

## 6.1.0 : 14 Jan 2020
- Update terser to 4.6.3
- Bump version to 6.1.0
- Require 12.14.0 or higher

## 6.0.0 : 14 Nov 2019
- Update csso to 4.0.2
- Update svgo to 1.3.2
- Update terser to 4.4.0

## 5.1.0 : 2019-09-30
- New http-compression option, none

## 5.0.1 : 2019-09-27
- Missed the commit order for 5.0.0

## 5.0.0 : 2019-09-27
- Simplify the code around promises
- Really fix compression / no compression this time
- New tests for HTTP compression of minified results
- Provide a way to ask for br or gzip compression as a URL parameter, along with the compression level

## 4.3.1 : 2019-09-16
- Unbreak requests with no compression support

## 4.3.0 : 2019-09-14
- Support brotli, gzip, and deflate compression after minification

## 4.2.2 : 2019-09-12
- Remove unused code

## 4.2.1 : 2019-09-12
- Fix JavaScript test
- Sync up with the module updates

## 4.2.0 : 2019-09-11
- New passthough jpg URL to test against
- Internal type parameter, string/binary
- Update 'got' module to 9.6.0
- Update 'svgo' module to 1.3.0
- Update 'html-minifier' module to 4.0.0
- Update 'terser' module to 4.3.1

## 4.1.1 : 2018-11-21
- Add a JPG pass through test
- Log pass through requests
- Update 'got' module to 9.3.2
- Update 'terser' module to 3.10.12

## 4.1.0 : 2018-11-07
- Fix passing through binary items that are not minified
- Bump html-minifier to 3.5.21
- Added test.sh, a simple test for each supported resource type
