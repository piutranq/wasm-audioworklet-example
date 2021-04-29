function initAudioContext (moduleList) {
  const audioContext = new AudioContext()
  return Promise.all(moduleList.map(
    entry => audioContext.audioWorklet.addModule(entry)
  )).then(() => audioContext)
}

let actx
const playButton = document.querySelector('#playButton')

playButton.addEventListener('click', async () => {
  if (playButton.classList.contains('audio-playing')) {
    // the audio context is playing
    await actx.suspend()
    playButton.classList.replace('audio-playing', 'audio-paused')
    playButton.classList.replace('fa-pause', 'fa-play')
  } else if (playButton.classList.contains('audio-paused')) {
    // the audio context is paused
    await actx.resume()
    playButton.classList.replace('audio-paused', 'audio-playing')
    playButton.classList.replace('fa-play', 'fa-pause')
  } else {
    // no audio context

    // init audio context and audio worklet node
    actx = await initAudioContext(['js/aw.bundle.js'])
    const awn = new AudioWorkletNode(actx, 'customProcessor')

    // load the wasm module and send the module to audio worklet scope.
    await fetch('wasm/soundchip.wasm')
      .then(r => r.arrayBuffer())
      .then(r => awn.port.postMessage({ type: 'loadWasm', data: r }))

    // connect audio worklet node to speaker
    awn.connect(actx.destination)

    playButton.classList.add('audio-playing')
    playButton.classList.replace('fa-play', 'fa-pause')
  }
})
