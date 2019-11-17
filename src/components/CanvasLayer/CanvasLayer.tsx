import * as React from "react";
import { ICanvasLayer } from "../../types/CanvasLayer";

interface ICanvasLayerProps extends ICanvasLayer {
  onMouseDown: (event: React.MouseEvent<SVGImageElement, MouseEvent>) => void;
  onMouseUp: (event: React.MouseEvent<SVGImageElement, MouseEvent>) => void;
  onClick: (event: React.MouseEvent<SVGImageElement, MouseEvent>) => void;
}

const CanvasLayer: React.FC<ICanvasLayerProps> = props => {
  const {
    base64,
    width,
    height,
    onMouseDown,
    onMouseUp,
    onClick,
    x,
    y,
    effects
  } = props;
  return (
    <image
      xlinkHref={base64}
      width={width}
      height={height}
      transform={`translate(${x}, ${y}) scale(${effects.scale}, ${
        effects.scale
      }) rotate(${effects.rotate} ${width / 2} ${height / 2})`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
    />
  );
};

export default CanvasLayer;
