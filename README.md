# minifiers

[![Tests](https://github.com/Automattic/minifiers/actions/workflows/requests.yml/badge.svg)](https://github.com/Automattic/minifiers/actions)

HTTP minification server for CSS, HTML, JavaScript, JSON, and SVG.

## Usage
```
npm install
node server.js [OPTION]

Options:
  -p, --port=4747 The TCP port that the web server will listen on. (default: 4747)
  -h, --help      display this help
```

## Docker

```
$ docker build -t minifiers .
$ docker run -p 4747:4747 minifiers
```

## Tests

With the minifiers server already running, do `npm test`.

## Examples

The `tests/*.js` files are good reference for examples.

`
http://localhost:4747/get?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`

`
http://localhost:4747/get?with=gzip&leve=9&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`

`
http://localhost:4747/get?with=br&level=11&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`

`
http://localhost:4747/get?minify=false&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`

## Debugging and Observability

Before running, set these environment variables to change the default behavior:

```bash
export DEBUG_MEMORY=1        # to enable memory usage logging to console
export DEBUG_POOL=1          # to enable pool stat logging to console
export DEBUG_QUIET_REQUEST=1 # to disable request logging to console
```

These 3 work well together when doing a load test.

For fish shell users:

```fish
set -x DEBUG_MEMORY 1
set -x DEBUG_POOL 1
set -x DEBUG_QUIET_REQUEST 1
```
