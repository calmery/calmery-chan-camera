import * as React from "react";
import { connect } from "react-redux";
import { ICanvasLayer, CanvasLayerKind } from "../../types/CanvasLayer";
import CanvasLayer from "../../components/CanvasLayer";

interface ICanvasState {
  canvasLayers: ICanvasLayer[];
  canvas: {
    width: number;
    height: number;
  };
}

class Canvas extends React.Component<{}, ICanvasState> {
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
  ): Promise<ICanvasLayer> => {
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
          x: 0,
          y: 0,
          effects: {
            scale: 1,
            rotate: 0
          }
        });
      };

      image.src = imageUrl;
    });
  };

  private getBaseLayer = (): ICanvasLayer | undefined => {
    const { canvasLayers } = this.state;
    return canvasLayers.find(({ kind }) => kind === CanvasLayerKind.base);
  };

  private renderCanvasLayer = (canvasLayer: ICanvasLayer, index: number) => {
    return <CanvasLayer key={index} {...canvasLayer} />;
  };
}

export default connect(
  () => ({}),
  () => ({})
)(Canvas);
