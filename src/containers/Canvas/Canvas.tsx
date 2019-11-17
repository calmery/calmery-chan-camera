import * as React from "react";
import { connect } from "react-redux";

enum CanvasLayerKind {
  base,
  normal
}

interface CanvasLayer {
  kind: CanvasLayerKind;
  base64: string;
  width: number;
  height: number;
  effects: {
    scale: number;
    rotate: number;
  };
}

interface CanvasState {
  canvasLayers: CanvasLayer[];
  canvas: {
    width: number;
    height: number;
  };
}

class Canvas extends React.Component<{}, CanvasState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      canvasLayers: [],
      canvas: {
        width: 900,
        height: 300
      }
    };
  }

  public componentDidMount = async () => {
    this.setState({
      ...this.state,
      canvasLayers: [
        await this.convertUrlToLayer(
          CanvasLayerKind.base,
          "/images/background.jpg"
        ),
        await this.convertUrlToLayer(
          CanvasLayerKind.normal,
          "/images/layer.png"
        )
      ]
    });
  };

  public render = () => {
    const { canvas, canvasLayers } = this.state;
    const baseLayer = this.getBaseLayer();

    if (baseLayer === undefined) {
      return null;
    }

    return (
      <svg
        width={canvas.width}
        height={canvas.height}
        viewBox={`0 0 ${baseLayer.width} ${baseLayer.height}`}
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {canvasLayers.map(this.renderCanvasLayer)}
      </svg>
    );
  };

  private convertUrlToLayer = (
    kind: CanvasLayerKind,
    imageUrl: string
  ): Promise<CanvasLayer> => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const { width, height } = image;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (context === null) {
          return reject();
        }

        context.drawImage(image, 0, 0);

        resolve({
          kind,
          base64: canvas.toDataURL("image/png"),
          width,
          height,
          effects: {
            scale: 1,
            rotate: 0
          }
        });
      };

      image.src = imageUrl;
    });
  };

  private getBaseLayer = (): CanvasLayer | undefined => {
    const { canvasLayers } = this.state;
    return canvasLayers.find(({ kind }) => kind === CanvasLayerKind.base);
  };

  private renderCanvasLayer = (canvasLayer: CanvasLayer, index: number) => {
    const { base64, width, height } = canvasLayer;

    return (
      <image key={index} xlinkHref={base64} width={width} height={height} />
    );
  };
}

export default connect(
  () => ({}),
  () => ({})
)(Canvas);
