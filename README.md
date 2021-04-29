# wasm-audioworklet-example
The simple audio worklet example, using web assembly compiled from rust.

Inspired by
- [the-drunk-coder/ruffbox](https://github.com/the-drunk-coder/ruffbox)
- [reprimande/wasm-audioworklet-synth](https://github.com/reprimande/wasm-audioworklet-synth)

## Required
- Build
  - Node.js (tested on `node v14.16.0` & `npm 7.10.0`)
  - Rust (tested on `rustc 1.51.0` & `cargo 1.51.0`)

- Browser features
  - [AudioWorklet](https://caniuse.com/?search=AudioWorklet)
  - [Async Functions (ES2017)](https://caniuse.com/?search=async%20functions)

- Tested Browser
  - Chromium Stable (tested on 90)
  - Firefox Stable (tested on 88)

## Play the demo

```bash
npm install
npm run build
npm run serve
```

and browse `http://localhost:8080`

※ The repo is using `webpack` to build the sources,
but not using `webpack-dev-server` for test/demo.
So every changes are not applied instantly
but need manually rebuild and refresh.