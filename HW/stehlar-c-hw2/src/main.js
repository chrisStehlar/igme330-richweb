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
import { Sprite } from './sprite.js';

const drawParams = {
    showGradient : true,
    showBars : true,
    showCircles : true,
    showNoise : false,
    showInvert : false,
    showEmboss : false,
    visualMode : "frequency",
    showSprites : true
};

const audioParams = {
  trebleActive : false,
  bassActive : false,
  distortionActive : false
};

let hippo = new Sprite(200, 200, "media/hippo.png", 5);
let giraffe = new Sprite(300, 100, "media/giraffe.png", -3);
let movementOn = false;

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio("media/Joe Satriani - Sahara.mp3");
  initJSON();
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);

  canvas.setupCanvas(canvasElement, audio.analyserNode);

  loop();
}

function initJSON()
{
  let json;
  const url = "data/av-data.json";
  const xhr = new XMLHttpRequest();

  xhr.onload = (e) => {
      let responseText = e.target.responseText;

      try{
          json = JSON.parse(responseText);

          if(json != null)
          {
            document.querySelector("h1").innerHTML = json.title;

            let trackSelect = document.querySelector("#track-select");
            json.audioFiles.forEach(file => {
              let option = document.createElement("option");
              option.value = "media/" + file.name;
              option.text = file.name.replace(".mp3", "");
              trackSelect.appendChild(option);
            });

            document.querySelector("#instructions").innerHTML = json.instructions;
          }
      }
      catch{
          console.log("Could not parse the JSON.");
          return;
      }
  }

  xhr.open("GET", url);
  xhr.send();
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
        movementOn = true;
    }
    else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
        movementOn = false;
    }
  };

  // C - hookup volume slider and label
  let volumeSlider = document.querySelector("#volume-slider");
  let volumeLabel = document.querySelector("#volume-label");

  volumeSlider.oninput = e => {
    audio.setVolume(e.target.value);
    volumeLabel.innerHTML = Math.round(e.target.value/2 * 100);
    let value = Math.round(e.target.value/2 * 100);

    hippo.velocity = {x: (value / 18) * Math.sign(hippo.velocity.x) , y: (value / 16) * Math.sign(hippo.velocity.x)};
    giraffe.velocity = {x: (value / 16) * Math.sign(hippo.velocity.x) , y: (value / 18) * Math.sign(hippo.velocity.x)};
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
  let spritesCheckbox = document.querySelector("#sprites-cb");

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

  spritesCheckbox.onchange = e => {
    drawParams.showSprites = !drawParams.showSprites;
    hippo.y = 200;
    giraffe.y = 300;
  };

  // treble, bass, disortion

  let distortionSlider = document.querySelector("#distortion-volume-slider");
  let disortionVolumeLabel = document.querySelector("#distortion-volume-label");
  disortionVolumeLabel.innerHTML = Math.round(distortionSlider.value/2 * 100);

  distortionSlider.oninput = e => {
    let value  = Math.round(e.target.value/2 * 100);
    disortionVolumeLabel.innerHTML = value;
    audio.toggleDistortion(audioParams.distortionActive, value);
  };

  let distortionCheckbox = document.querySelector("#distortion-cb");
  distortionCheckbox.onchange = e => {
    audioParams.distortionActive = !audioParams.distortionActive;
    let value = Math.round(e.target.value/2 * 100);
    disortionVolumeLabel.innerHTML = value;

    audio.toggleDistortion(audioParams.distortionActive, value);
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

  // visual mode

  let visualModeSelect = document.querySelector("#visualization-mode");
  visualModeSelect.onchange = e => {
    drawParams.visualMode = e.target.value;
  };

} // end setupUI

function loop(){
    setTimeout(loop, 1/60.0);
    canvas.draw(drawParams);

    if(drawParams.showSprites)
    {
      canvas.drawSprite(hippo);
      canvas.drawSprite(giraffe);
      
      if(movementOn)
      {
        hippo.update();
        giraffe.update();
      }
    }

}

export {init};