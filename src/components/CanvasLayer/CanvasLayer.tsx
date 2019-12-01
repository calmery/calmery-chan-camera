import * as React from "react";
import { ICanvasLayer } from "../../types/CanvasLayer";

interface ICanvasLayerProps {
  canvasLayer: ICanvasLayer;
  onTouchStart: (event: React.TouchEvent<SVGImageElement>) => void;
  onTouchEnd: (event: React.TouchEvent<SVGImageElement>) => void;
  onMouseDown: (event: React.MouseEvent<SVGImageElement, MouseEvent>) => void;
  onMouseUp: (event: React.MouseEvent<SVGImageElement, MouseEvent>) => void;
}

const CanvasLayer: React.FC<ICanvasLayerProps> = props => {
  const {
    canvasLayer,
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd
  } = props;
  return (
    <image
      xlinkHref={canvasLayer.base64}
      width={canvasLayer.width}
      height={canvasLayer.height}
      transform={`translate(${canvasLayer.x}, ${canvasLayer.y}) scale(${
        canvasLayer.effects.scale
      }, ${canvasLayer.effects.scale}) rotate(${
        canvasLayer.effects.rotate
      } ${canvasLayer.width / 2} ${canvasLayer.height / 2})`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
  );
};

export { CanvasLayer };
