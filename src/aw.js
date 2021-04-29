/* global currentFrame:readonly */

const SAMPLE_BUFSIZE = 128

/* I don't know why the `importObject` is needed,
 * because rust crate doesn't use any function from JS.
 * but compiled wasm has imported "$now" function at first line.
 * `(func $now (;0;) (import "env" "now") (result f64))`
 * so I send the empty function `env.now` in `importObject`.
*/
const importObject = { env: { now: () => {} } }

class SoundChip extends AudioWorkletProcessor {
  constructor () {
    super()
    this.setupMessageHandler()
  }

  setupMessageHandler () {
    this.port.onmessage = async e => {
      // The wasm module can't be loaded directly in worklet scope,
      // because `fetch()` isn't work in the scope.
      // so the wasm is loaded at main window and sent as message.
      if (e.data.type === 'loadWasm') {
        await this.initWasm(e.data.data)
      }
    }
  }

  async initWasm (data) {
    this._wasm = await WebAssembly.instantiate(data, importObject)
      .then(w => w.instance)
    this._outPtr = this._wasm.exports.buffer_alloc(SAMPLE_BUFSIZE)
    this._outBuf = new Float32Array(
      this._wasm.exports.memory.buffer,
      this._outPtr,
      SAMPLE_BUFSIZE
    )
  }

  process (inputs, outputs, params) {
    if (!this._wasm) return true

    // actual process in wasm module: see crate/src/lib.rs
    this._wasm.exports.process(this._outPtr, currentFrame)

    // Sync the output buffer
    for (let num = 0; num < outputs.length; num++) {
      for (let ch = 0; ch < outputs[num].length; ch++) {
        outputs[num][ch].set(this._outBuf)
      }
    }

    return true
  }
}

registerProcessor('customProcessor', SoundChip)
