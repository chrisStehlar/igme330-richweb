const makeColor = (red: number, green: number, blue: number, alpha: number = 1): string => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomColor = (): string => {
  const floor = 35; // so that colors are not too bright or too dark 
  const getByte = (): number => getRandom(floor, 255 - floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number, colorStops: { percent: number, color: string }[]): CanvasGradient => {
  let lg = ctx.createLinearGradient(startX, startY, endX, endY);
  for (let stop of colorStops) {
    lg.addColorStop(stop.percent, stop.color);
  }
  return lg;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
const goFullscreen = (element: HTMLElement): void => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  }
};

export { makeColor, getRandomColor, getLinearGradient, goFullscreen };