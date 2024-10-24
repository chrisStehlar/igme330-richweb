import { getRandomInt, getRandomColor } from "./utils.js";

// canvas helpers
export const drawRectangle = (ctx, x, y, width, height, fillStyle="black", lineWidth=0, strokeStyle="black") =>
{
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.fill();
    if(lineWidth > 0 ){
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

export const drawArc = (ctx, x, y, radius, fillStyle="black", lineWidth=0, strokeStyle="black", startAngle=0, endAngle=Math.PI*2) =>
{
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x,y, radius, startAngle, endAngle);
    ctx.fill();
    if(lineWidth > 0 ){
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}

export const drawLine = (ctx, x1, y1, x2, y2, lineWidth=1, strokeStyle="black") =>
{
    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

export const drawRandomRect = (ctx, maxWidth, maxHeight) =>
{
    drawRectangle(ctx, getRandomInt(0, maxWidth), getRandomInt(0, maxHeight), getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(), getRandomInt(2 ,12), getRandomColor());
}

export const drawRandomArc = (ctx, maxWidth, maxHeight) =>
{
    drawArc(ctx, getRandomInt(0, maxWidth), getRandomInt(0, maxHeight), getRandomInt(10, 90), getRandomColor(), getRandomInt(2, 12), getRandomColor());
}

export const drawRandomLine = (ctx, maxWidth, maxHeight) =>
{
    drawLine(ctx, getRandomInt(0, maxWidth), getRandomInt(0, maxHeight), getRandomInt(0, maxWidth), getRandomInt(0, maxHeight), getRandomInt(2,12), getRandomColor());
}