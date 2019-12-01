export enum CANVAS_LAYER_KIND {
  BASE,
  NORMAL,
  LOGO
}

export interface ICanvasLayer {
  id?: number;
  kind: CANVAS_LAYER_KIND;
  base64: string;
  width: number;
  height: number;
  x: number;
  y: number;
  effects: {
    scale: number;
    rotate: number;
    flip: 1 | -1;
  };
}
