import { getRandomColor, getRandomInt } from "./utils.js";
import { drawArc, drawLine, drawRectangle, drawRandomArc, drawRandomLine, drawRandomRect } from "./canvas-utils.js";

let ctx;
let width, height;
let paused = true;
let canvas;
let createRectangles = true;
let createArcs = true;
let createLines = true;

// event handler
const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX,mouseY);

    for(let i = 0 ; i < 10; i++)
    {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(20, 50);
        let color = getRandomColor();
        drawArc(ctx, x, y, radius, color);
    }
}

const setupUI = () => {
    document.querySelector("#btn-pause").onclick = function(){
        paused = true;
    };

    document.querySelector("#btn-play").onclick = function(){
        let pausedCheck = paused; // see if there is a difference in pause - fixes the play button spam
        paused = false;
        if(pausedCheck != paused) update();
    };

    document.querySelector("#btn-clear").onclick = function(){
        ctx.fillStyle = getRandomColor();    
        ctx.fillRect(0,0, width, height);
    };

    canvas.onclick = canvasClicked;

    document.querySelector("#cb-rectangles").onclick = function(e){
        createRectangles = e.target.checked;
    }

    document.querySelector("#cb-arcs").onclick = function(e){
        createArcs = e.target.checked;
    }

    document.querySelector("#cb-lines").onclick = function(e){
        createLines = e.target.checked;
    }
}

// called once on start
const init = () => {
    canvas = document.querySelector("canvas");
    console.log(canvas);
    width = canvas.width;
    height = canvas.height;
    
    ctx = canvas.getContext("2d");

    initBackground();

    setupUI();
    update();
}

// draws the face + background
const initBackground = () =>
{
    ctx.fillStyle = "red"; 
    ctx.fillRect(20,20,600,440); 

    drawRectangle(ctx, 120, 120, 400, 300, "yellow", 10, "magenta");

    // lines
    drawLine(ctx, 20, 20, 620, 460, 5, "magenta");
    drawLine(ctx, 620, 20, 20, 460, 5, "magenta");

    // circle
    drawArc(ctx, 320, 240, 50, "green", 5, "purple");

    // semi circle
    drawArc(ctx, 320, 240, 20, "gray", 5, "yellow", 0, Math.PI);

    // eyes
    drawArc(ctx, 300, 220, 10, "teal", 5, "brown");
    drawArc(ctx, 340, 220, 10, "teal", 5, "brown");

    // line
    drawLine(ctx, 20, 50, 620, 50, 20);
}

const update = () =>
{
    if(paused) return;

    if(createRectangles) drawRandomRect(ctx, width, height);
    
    if(createArcs) drawRandomArc(ctx, width, height);

    if(createLines) drawRandomLine(ctx, width, height);

    requestAnimationFrame(update);
}

init()