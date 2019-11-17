export enum CanvasLayerKind {
  base,
  normal
}

export interface ICanvasLayer {
  kind: CanvasLayerKind;
  base64: string;
  width: number;
  height: number;
  x: number;
  y: number;
  effects: {
    scale: number;
    rotate: number;
  };
}
