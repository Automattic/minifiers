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

## Run Time Configuration

JS Minification is done by a pool of child processes running swc. We use these
optional environment variables to configure the pool:

```
const opts = {
	min: parseInt( process.env.MINIFIERS_MIN_CHILD_PROCESSES, 10 ) || os.cpus().length,
	max: parseInt( process.env.MINIFIERS_MAX_CHILD_PROCESSES, 10 ) || os.cpus().length * 2,
	evictionRunIntervalMillis: parseInt( process.env.MINIFIERS_EVICTION_INTERVAL, 10 ) || 10000,
	softIdleTimeoutMillis: parseInt( process.env.MINIFIERS_SOFT_IDLE_TIMEOUT, 10 ) || 10000,
	idleTimeoutMillis: parseInt( process.env.MINIFIERS_IDLE_TIMEOUT, 10 ) || 30000,
};
```

The exact meaning of the settings is documented in the [generic-pool
readme](https://www.npmjs.com/package/generic-pool).

---

- The environment variable `MINIFIERS_MINIFICATIONS_PER_PROCESS` controls the number of minifications
  that each child process should handle before that process restarts.

* Set `MINIFIERS_DISABLE_COMPRESSION` to 1 to disable compression.

* Set `MINIFIERS_BASE_PATH` to choose a path of files served through the
  /file endpoint. May be absolute or relative. If relative, relative to the
  repository root directory. Defaults to the repository root.

## Tests

Do `npm test`.

## Manual Testing

After starting the server with `npm start` or `node server.js`, you can test different functionalities using these example URLs:

### CSS Minification and Compression

```
# Basic CSS minification
http://localhost:4747/get?url=https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.css

# CSS with Gzip compression
http://localhost:4747/get?with=gzip&level=9&url=https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.css

# CSS with Brotli compression
http://localhost:4747/get?with=br&level=11&url=https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.css
```

### JavaScript Minification

```
# Basic JS minification
http://localhost:4747/get?url=https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.js

# JS with minification disabled
http://localhost:4747/get?minify=false&url=https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.js
```

### Other File Types

```
# HTML minification
http://localhost:4747/get?url=https://raw.githubusercontent.com/h5bp/html5-boilerplate/refs/heads/main/dist/index.html

# SVG minification
http://localhost:4747/get?url=https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/javascript.svg
```

## Examples

The `tests/*.js` files are good reference for examples.

`http://localhost:4747/get?url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css`

`http://localhost:4747/get?with=gzip&leve=9&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css`

`http://localhost:4747/get?with=br&level=11&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css`

`http://localhost:4747/get?minify=false&url=https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.css`

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
