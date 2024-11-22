import * as utils from './utils.js';
import * as audio from './audio';
import * as canvas from './canvas';
import { Sprite } from './sprite';

/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!


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

const hippo = new Sprite(200, 200, "media/hippo.png", 5);
const giraffe = new Sprite(300, 100, "media/giraffe.png", -3);
let movementOn = false;

const init = () => {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio("media/Joe Satriani - Sahara.mp3");
  initJSON();
  const canvasElement = document.querySelector("canvas")!; // hookup <canvas> element
  setupUI(canvasElement);

  canvas.setupCanvas(canvasElement, audio.analyserNode);

  loop();
};

const initJSON = () => {
  let json;
  const url = "data/av-data.json";
  const xhr = new XMLHttpRequest();

  xhr.onload = (e: Event) => {
    let responseText = (e.target as XMLHttpRequest).responseText;

    try{
      json = JSON.parse(responseText);

      if(json != null)
      {
        const h1Element = document.querySelector("h1");
        if (h1Element) {
          h1Element.innerHTML = json.title;
        }

        let trackSelect = document.querySelector("#track-select");
        json.audioFiles.forEach((file: { name: string }) => {
          let option = document.createElement("option");
          option.value = "media/" + file.name;
          option.text = file.name.replace(".mp3", "");
          if (trackSelect) {
            trackSelect.appendChild(option);
          }
        });

        const instructionsElement = document.querySelector("#instructions");
        if(instructionsElement){
          instructionsElement.innerHTML = json.instructions;
        }
      }
    }
    catch{
      console.log("Could not parse the JSON.");
      return;
    }
  };

  xhr.open("GET", url);
  xhr.send();
};

const setupUI = (canvasElement : HTMLCanvasElement) => {
  // A - hookup fullscreen button
  const fsButton: HTMLButtonElement = document.querySelector("#btn-fullscreen")!;
  const playButton: HTMLButtonElement = document.querySelector("#btn-play")!;
  
  // add .onclick event to button
  fsButton.onclick = e => {
  console.log("goFullscreen() called");
  utils.goFullscreen(canvasElement);
  };

  // B - add onclick event for play button to start the music
  playButton.onclick = (e: MouseEvent) => {
    //console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
  
    // check if audiocontext is in suspended state because of autoplay pausing
    if(audio.audioCtx.state == "suspended")
    {
      audio.audioCtx.resume();
    }
    //console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if((e.target as HTMLButtonElement).dataset.playing == "no"){
      // if track is currently paused then play it
      audio.playCurrentSound();
      (e.target as HTMLButtonElement).dataset.playing = "yes";
      movementOn = true;
    }
    else{
      audio.pauseCurrentSound();
      (e.target as HTMLButtonElement).dataset.playing = "no";
      movementOn = false;
    }
  };

  // C - hookup volume slider and label
  const volumeSlider: HTMLInputElement = document.querySelector("#volume-slider")!;
  const volumeLabel: HTMLButtonElement = document.querySelector("#volume-label")!;

  volumeSlider.oninput = (e: Event) => {
    const sliderValue : number = Number((e.target as HTMLInputElement).value);
    audio.setVolume(sliderValue);
    volumeLabel.innerHTML = Math.round(sliderValue / 2 * 100).toString();
    const value = Math.round(sliderValue / 2 * 100);
  
    hippo.velocity = { x: (value / 18) * Math.sign(hippo.velocity.x), y: (value / 16) * Math.sign(hippo.velocity.x) };
    giraffe.velocity = { x: (value / 16) * Math.sign(hippo.velocity.x), y: (value / 18) * Math.sign(hippo.velocity.x) };
  };

  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  const trackSelect : HTMLButtonElement = document.querySelector("#track-select")!;

  trackSelect.onchange = (e:Event) => {
  audio.loadSoundFile((e.target as HTMLInputElement).value);
  if(playButton.dataset.playing == "yes"){
    playButton.dispatchEvent(new MouseEvent("click"));
  }
  };

  // checkboxes
  const gradientCheckbox: HTMLButtonElement = document.querySelector("#gradient-cb")!;
  const barsCheckbox: HTMLButtonElement = document.querySelector("#bars-cb")!;
  const circlesCheckbox: HTMLButtonElement = document.querySelector("#circles-cb")!;
  const noiseCheckbox: HTMLButtonElement = document.querySelector("#noise-cb")!;
  const invertCheckbox: HTMLButtonElement = document.querySelector("#invert-cb")!;
  const embossCheckbox: HTMLButtonElement = document.querySelector("#emboss-cb")!;
  const spritesCheckbox: HTMLButtonElement = document.querySelector("#sprites-cb")!;

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

  const distortionSlider: HTMLButtonElement = document.querySelector("#distortion-volume-slider")!;
  const disortionVolumeLabel: HTMLButtonElement = document.querySelector("#distortion-volume-label")!;
  disortionVolumeLabel.innerHTML = Math.round(Number(distortionSlider.value)/2 * 100).toString();

  distortionSlider.oninput = (e:Event) => {
    const sliderValue : number = Number((e.target as HTMLInputElement).value);
    const value  = Math.round(sliderValue /2 * 100);
    disortionVolumeLabel.innerHTML = value.toString();
    audio.toggleDistortion(audioParams.distortionActive, value);
  };

  const distortionCheckbox : HTMLButtonElement= document.querySelector("#distortion-cb")!;
  distortionCheckbox.onchange = e => {
    audioParams.distortionActive = !audioParams.distortionActive;
    const sliderValue : number = Number((e.target as HTMLInputElement).value);
    const value  = Math.round(sliderValue /2 * 100);
    disortionVolumeLabel.innerHTML = value.toString();

    audio.toggleDistortion(audioParams.distortionActive, value);
  };

  const trebleCheckbox : HTMLButtonElement= document.querySelector("#treble-cb")!;
  const bassCheckbox: HTMLButtonElement = document.querySelector("#bass-cb")!;

  trebleCheckbox.onchange = e => {
  audioParams.trebleActive = !audioParams.trebleActive;
  audio.toggleHighpass(audioParams.trebleActive);
  };

  bassCheckbox.onchange = e => {
  audioParams.bassActive = !audioParams.bassActive;
  audio.toggleHighpass(audioParams.bassActive);
  };

  // visual mode

  const visualModeSelect: HTMLButtonElement = document.querySelector("#visualization-mode")!;
  visualModeSelect.onchange = e => {
    const target = e.target as HTMLSelectElement;
    drawParams.visualMode = target.value;
  };

}; // end setupUI

const loop = () => {
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

};

export { init };
