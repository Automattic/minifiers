# AGENTS.md

This repository runs an HTTP minification service for CSS, HTML, JavaScript, JSON, and SVG.

## Scope

These instructions apply to the whole repository.

## Project Map

- `server.js`: Fastify server bootstrap, route registration, CLI port handling.
- `routes/`: HTTP handlers.
  - `routes/get.js`: Fetches remote URL content, minifies/compresses output.
  - `routes/file.js`: Reads local files under base path, minifies/compresses output, optional `/dev/shm` cache.
  - `routes/health-check.js`, `routes/index.js`: basic health/index endpoints.
- `lib/`: Minification and compression implementation details.
  - `lib/minify.js`: type dispatch for minification.
  - `lib/compress.js`: gzip/br/deflate selection.
  - `lib/validate-path.js`: CRITICAL path traversal protection for `/file`.
  - `lib/processes/`: JS minification child-process pool.
- `tests/`: Jest integration tests against a spawned local server.
- `.github/workflows/requests.yml`: CI runs `npm test` on pushes/PRs to `trunk`.

## Setup And Commands

- Install dependencies:
  - `npm install`
- Run tests:
  - `npm test`
- Format files:
  - `npm run prettify`
- Run service locally on default port `4747`:
  - `node server.js`
- Run service on custom port:
  - `node server.js --port=4747`
- Containerized local run:
  - `docker build -t minifiers .`
  - `docker run -p 4747:4747 minifiers`

## Runtime Environment

Important environment variables:

- Pool configuration:
  - `MINIFIERS_MIN_CHILD_PROCESSES`
  - `MINIFIERS_MAX_CHILD_PROCESSES`
  - `MINIFIERS_EVICTION_INTERVAL`
  - `MINIFIERS_SOFT_IDLE_TIMEOUT`
  - `MINIFIERS_IDLE_TIMEOUT`
  - `MINIFIERS_MINIFICATIONS_PER_PROCESS`
- Behavior toggles:
  - `MINIFIERS_DISABLE_COMPRESSION=1` disables compression.
  - `MINIFIERS_BASE_PATH` changes root directory for `/file` endpoint.
- Debugging:
  - `DEBUG_MEMORY=1`
  - `DEBUG_POOL=1`
  - `DEBUG_QUIET_REQUEST=1`

## Conventions

- Use existing CommonJS style (`require`, `module.exports`) unless there is a strong reason to change.
- Keep route behavior backward compatible:
  - `/get` supports both `GET` and `OPTIONS`.
  - Response headers like `x-minify`, `x-minify-cache`, and `x-minify-compression-level` are contract-like and should not change without tests and release notes.
- When adding/changing behavior, update or add Jest tests in `tests/*.test.js`.
- Run `npm run prettify` after code changes in tracked paths.
- Do not add new dependencies unless required by functionality and justified.

## CRITICAL Architectural Decisions

- CRITICAL: Do not bypass `lib/validate-path.js` for `/file` requests. Path normalization and base-path checks are the traversal guardrail.
- CRITICAL: Keep minification-type dispatch centralized in `lib/minify.js` + `config.js`; avoid duplicating per-content-type logic in routes.
- CRITICAL: JavaScript minification currently uses the child-process pool implementation (`lib/processes/js-min-parent.js`) by design.

## Common Pitfalls

- `README.md` examples may mention `npm start`, but there is no `start` script in `package.json`. Use `node server.js`.
- Tests under `tests/get-*.test.js` and some env tests fetch external URLs. They can fail due to network/provider instability even when local changes are correct.
- `/file` route intentionally skips minification for paths containing `.dev.` or `.min.`.
- `/dev/shm` caching behavior in `routes/file.js` is platform-dependent; do not assume cache exists on all environments.
- For JavaScript MIME handling, `text/javascript` is normalized to `application/javascript` in route handling.

## E2E Verification Checklist

After implementing changes, do at least one local endpoint-level verification in addition to tests:

1. Start server: `node server.js --port=4747`
2. Verify health endpoint:
   - `curl -i http://localhost:4747/health-check`
3. Verify local file minification flow (network-independent):
   - `curl -i "http://localhost:4747/file?path=tests/bootstrap.css"`
4. Verify compression response path:
   - `curl -i "http://localhost:4747/file?with=gzip&level=9&path=tests/bootstrap.css"`

## Done Criteria For Agent Changes

- Code compiles/runs for touched paths.
- Relevant tests pass (`npm test` at minimum; targeted tests acceptable during iteration).
- Endpoint behavior is verified for at least one affected route.
- Documentation/tests are updated when behavior changes.

