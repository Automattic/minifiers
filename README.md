# minifiers
HTTP minification server for CSS, HTML, JavaScript, and SVG.

## Usage
```
Usage:
  npm install
  node server.js [OPTION]

Options:
  -p, --port=4000 The TCP port that the web server will listen on. (default: 4000)
  -h, --help      display this help
```

## Tests

With the minifiers server already running, do `npm test`.

## Examples

`
http://localhost:4747/get?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`

`
http://localhost:4747/get?with=gzip&leve=9&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`

`
http://localhost:4747/get?with=br&level=11&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css
`
