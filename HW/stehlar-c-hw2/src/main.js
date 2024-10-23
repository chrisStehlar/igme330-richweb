/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient : true,
    showBars : true,
    showCircles : true,
    showNoise : false,
    showInvert : false,
    showEmboss : false
};

const audioParams = {
  trebleActive : false,
  bassActive : false,
  distortionActive : false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Joe Satriani - Sahara.mp3"
});

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);

    canvas.setupCanvas(canvasElement, audio.analyserNode);

    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fullscreen");
  const playButton = document.querySelector("#btn-play");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // B - add onclick event for play button to start the music
  playButton.onclick = e => {
    //console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if audiocontext is in suspended state because of autoplay pausing
    if(audio.audioCtx.state == "suspended")
    {
        audio.audioCtx.resume();
    }
    //console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
        // if track is currently paused then play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";
    }
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
    }
  };

  // C - hookup volume slider and label
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");

  volumeSlider.oninput = e => {
    audio.setVolume(e.target.value);
    volumeLabel.innerHTML = Math.round(e.target.value/2 * 100);
  };

  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#track-select");

  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    if(playButton.dataset.playing == "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  // checkboxes
  let gradientCheckbox = document.querySelector("#gradient-cb");
  let barsCheckbox = document.querySelector("#bars-cb");
  let circlesCheckbox = document.querySelector("#circles-cb");
  let noiseCheckbox = document.querySelector("#noise-cb");
  let invertCheckbox = document.querySelector("#invert-cb");
  let embossCheckbox = document.querySelector("#emboss-cb");

  gradientCheckbox.onchange = e => {
    drawParams.showGradient = !drawParams.showGradient;
  };

  barsCheckbox.onchange = e => {
    drawParams.showBars = !drawParams.showBars;
  };

  circlesCheckbox.onchange = e => {
    drawParams.showCircles = !drawParams.showCircles;
  };

  noiseCheckbox.onchange = e => {
    drawParams.showNoise = !drawParams.showNoise;
  };

  invertCheckbox.onchange = e => {
    drawParams.showInvert = !drawParams.showInvert;
  };

  embossCheckbox.onchange = e => {
    drawParams.showEmboss = !drawParams.showEmboss;
  };

  // treble, bass, disortion

  let distortionSlider = document.querySelector("#distortion-volume-slider");
  let disortionVolumeLabel = document.querySelector("#distortion-volume-label");
  disortionVolumeLabel.innerHTML = Math.round(distortionSlider.value/2 * 100);

  distortionSlider.oninput = e => {
    //audio.setDistortion(e.target.value);
    disortionVolumeLabel.innerHTML = Math.round(e.target.value/2 * 100);
    audio.toggleDistortion(audioParams.distortionActive, e.target.value);
  };

  let distortionCheckbox = document.querySelector("#distortion-cb");
  distortionCheckbox.onchange = e => {
    audioParams.distortionActive = !audioParams.distortionActive;
    disortionVolumeLabel.innerHTML = Math.round(distortionSlider.value/2 * 100);

    audio.toggleDistortion(audioParams.distortionActive, distortionSlider.value);
  };

  let trebleCheckbox = document.querySelector("#treble-cb");
  let bassCheckbox = document.querySelector("#bass-cb");

  trebleCheckbox.onchange = e => {
    audioParams.trebleActive = !audioParams.trebleActive;
    audio.toggleHighpass(audioParams.trebleActive);
  };

  bassCheckbox.onchange = e => {
    audioParams.bassActive = !audioParams.bassActive;
    audio.toggleHighpass(audioParams.bassActive);
  };

} // end setupUI

function loop(){
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
}

export {init};