# minifiers

[![Tests](https://github.com/Automattic/minifiers/actions/workflows/requests.yml/badge.svg?branch=acidburn)](https://github.com/Automattic/minifiers/actions)

HTTP minification server for CSS, HTML, JavaScript, JSON, and SVG.

## Usage
```
npm install
node server.js [OPTION]

Options:
  -p, --port=4747 The TCP port that the web server will listen on. (default: 4747)
  -h, --help      display this help
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
