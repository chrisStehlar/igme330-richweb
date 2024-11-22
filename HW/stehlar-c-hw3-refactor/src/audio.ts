let audioCtx: AudioContext;
let audioDomElement: HTMLAudioElement;
let sourceNode: MediaElementAudioSourceNode;
let analyserNode: AnalyserNode;
let gainNode: GainNode;
let biquadFilterNode: BiquadFilterNode;
let lowshelfBiquadFilterNode: BiquadFilterNode;
let distortionFilter: WaveShaperNode;

const DEFAULTS = Object.freeze({
    gain: .5,
    numSamples: 256
});

const setupWebaudio = (filePath: string): void => {
    const AudioContext = window.AudioContext;
    audioCtx = new AudioContext();

    audioDomElement = new Audio();

    loadSoundFile(filePath);

    sourceNode = audioCtx.createMediaElementSource(audioDomElement);

    analyserNode = audioCtx.createAnalyser();

    analyserNode.fftSize = DEFAULTS.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    biquadFilterNode = audioCtx.createBiquadFilter();
    biquadFilterNode.type = "highshelf";

    lowshelfBiquadFilterNode = audioCtx.createBiquadFilter();
    lowshelfBiquadFilterNode.type = "lowshelf";

    distortionFilter = audioCtx.createWaveShaper();

    sourceNode.connect(biquadFilterNode);
    biquadFilterNode.connect(lowshelfBiquadFilterNode);
    lowshelfBiquadFilterNode.connect(distortionFilter);
    distortionFilter.connect(analyserNode);

    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
};

const toggleHighpass = (isOn: boolean): void => {
    if (isOn) {
        biquadFilterNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
        biquadFilterNode.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        biquadFilterNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
};

const toggleLowpass = (isOn: boolean): void => {
    if (isOn) {
        lowshelfBiquadFilterNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowshelfBiquadFilterNode.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowshelfBiquadFilterNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
};

const toggleDistortion = (isOn: boolean, value: number): void => {
    if (isOn) {
        distortionFilter.curve = makeDistortionCurve(value);
    } else {
        distortionFilter.curve = null;
    }
};

const makeDistortionCurve = (amount = 20): Float32Array => {
    const n_samples = 256;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        const x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
};

const loadSoundFile = (filePath: string): void => {
    audioDomElement.src = filePath;
};

const playCurrentSound = (): void => {
    audioDomElement.play();
};

const pauseCurrentSound = (): void => {
    audioDomElement.pause();
};

const setVolume = (value: number): void => {
    value = Number(value);
    gainNode.gain.value = value;
};

export {
    audioCtx,
    setupWebaudio,
    playCurrentSound,
    pauseCurrentSound,
    loadSoundFile,
    setVolume,
    toggleHighpass,
    toggleLowpass,
    toggleDistortion,
    analyserNode
};
