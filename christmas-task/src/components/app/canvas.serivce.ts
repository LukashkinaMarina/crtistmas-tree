import { DrawCircleProps } from 'src/types/app.types';

export const CANVAS_X = 700;
export const CANVAS_Y = 750;

export const drawCircle = (props: DrawCircleProps): void => {
  const { ctx, radius, x, y, color, lineWidth = 1, strokeColor = 'rgba(0,0,0,0.6)' } = props;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
};

const hexToRgbA = (hex: string, alpha: number): string => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
  }
  throw new Error('Bad Hex');
};

const drawGarland = (ctx: CanvasRenderingContext2D, color: string): void => {
  const colors = ['#FF0000', '#00FF00', '#00FFFF', '#FFFF00'];
  const colorMap: Record<string, () => string> = {
    'garland-red': () => colors[0],
    'garland-green': () => colors[1],
    'garland-blue': () => colors[2],
    'garland-yellow': () => colors[3],
    'garland-multicolor': () => colors[Math.trunc(Math.random() * 3.99)],
  };
  const CENTER_X = 372;
  const START_Y = 20;
  const SPACE_BETWEEN_LINES = 65;
  const LINES_COUNT = 9;
  const BASE_CIRCLE_RADIUS = 5;
  for (let i = 0; i < LINES_COUNT; i++) {
    for (let k = 0; k < (15 + i) * (i / 4.8); k++) {
      let y =
        START_Y +
        Math.cos((-k * 50) / Math.PI) +
        (Math.sin((k / 10) * Math.PI) / Math.PI) * 10 +
        i * SPACE_BETWEEN_LINES -
        i +
        k;

      let x = k * 10 + CENTER_X - i * 25;
      drawCircle({ ctx, radius: BASE_CIRCLE_RADIUS, x, y, color: hexToRgbA(colorMap[color](), Math.random()) });
    }
  }
};

export const clearCanvas = (ctx: CanvasRenderingContext2D): void => {
  ctx.clearRect(0, 0, CANVAS_X, CANVAS_Y);
};

export const flashGarland = (ctx: CanvasRenderingContext2D, color: string): NodeJS.Timer => {
  return setInterval(() => {
    clearCanvas(ctx);
    drawGarland(ctx, color);
  }, 500);
};

export const initCanvas = (): CanvasRenderingContext2D => {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas');
  return <CanvasRenderingContext2D>canvas.getContext('2d');
};
