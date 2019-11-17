import * as React from "react";
import { ICanvasLayer } from "../../types/CanvasLayer";

const CanvasLayer: React.FC<ICanvasLayer> = props => {
  const { base64, width, height } = props;
  return <image xlinkHref={base64} width={width} height={height} />;
};

export default CanvasLayer;
