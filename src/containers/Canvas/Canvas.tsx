import * as React from "react";
import { connect } from "react-redux";
import { ICanvasLayer, CanvasLayerKind } from "../../types/CanvasLayer";
import CanvasLayer from "../../components/CanvasLayer";

interface ICanvasState {
  isDragging: boolean;
  selectedLayerIndex: number | null;
  offsetMousePosition: {
    x: number;
    y: number;
  };
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
      isDragging: false,
      selectedLayerIndex: null,
      offsetMousePosition: {
        x: 0,
        y: 0
      },
      canvasLayers: [],
      canvas: {
        width: 1500,
        height: 500
      }
    };
  }

  private container: React.RefObject<SVGSVGElement> = React.createRef();

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
      <React.Fragment>
        <svg
          ref={this.container}
          width={canvas.width}
          height={canvas.height}
          viewBox={`0 0 ${baseLayer.width} ${baseLayer.height}`}
          version="1.1"
          baseProfile="full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          onMouseMove={this.handleOnMouseMove}
        >
          {canvasLayers.map(this.renderCanvasLayer)}
        </svg>

        <input
          type="range"
          min="1"
          max="5"
          defaultValue="1"
          onChange={this.handleOnChangeScale}
        />
        <input
          type="range"
          min="0"
          max="359"
          defaultValue="0"
          onChange={this.handleOnChangeRotate}
        />
      </React.Fragment>
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
    return (
      <CanvasLayer
        key={index}
        {...canvasLayer}
        onMouseDown={event => this.handleOnMouseDown(event, index)}
        onMouseUp={event => this.handleOnMouseUp(event, index)}
      />
    );
  };

  // Events

  private handleOnChangeScale = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { selectedLayerIndex, canvasLayers } = this.state;

    if (selectedLayerIndex === null) {
      return;
    }

    const scale = parseInt(event.target.value, 10);
    const canvasLayer = canvasLayers[selectedLayerIndex!];

    canvasLayers[selectedLayerIndex!] = {
      ...canvasLayer,
      x:
        canvasLayer.x +
        (canvasLayer.width * canvasLayer.effects.scale -
          canvasLayer.width * scale) /
          2,
      y:
        canvasLayer.y +
        (canvasLayer.height * canvasLayer.effects.scale -
          canvasLayer.height * scale) /
          2,
      effects: {
        ...canvasLayer.effects,
        scale
      }
    };

    this.setState({ canvasLayers });
  };

  private handleOnChangeRotate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { selectedLayerIndex, canvasLayers } = this.state;

    if (selectedLayerIndex === null) {
      return;
    }

    const canvasLayer = canvasLayers[selectedLayerIndex!];

    canvasLayers[selectedLayerIndex!] = {
      ...canvasLayer,
      effects: {
        ...canvasLayer.effects,
        rotate: parseInt(event.target.value, 10)
      }
    };

    this.setState({ canvasLayers });
  };

  private handleOnMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const {
      selectedLayerIndex,
      isDragging,
      canvasLayers,
      offsetMousePosition
    } = this.state;

    if (!isDragging) {
      return;
    }

    const canvasLayer = canvasLayers[selectedLayerIndex!];

    if (this.container.current === null) {
      return;
    }

    const { x, y } = this.container.current.getBoundingClientRect() as DOMRect;

    canvasLayers[selectedLayerIndex!] = {
      ...canvasLayer,
      x: Math.round(event.clientX - x) + offsetMousePosition.x,
      y: Math.round(event.clientY - y) + offsetMousePosition.y
    };

    this.setState({ canvasLayers });
  };

  private handleOnMouseDown = (
    event: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => {
    const { canvasLayers } = this.state;
    const canvasLayer = canvasLayers[index];

    if (
      canvasLayer.kind === CanvasLayerKind.base ||
      this.container.current === null
    ) {
      return;
    }

    const { x, y } = this.container.current.getBoundingClientRect() as DOMRect;

    this.setState({
      isDragging: true,
      selectedLayerIndex: index,
      offsetMousePosition: {
        x: canvasLayer.x - Math.round(event.clientX - x),
        y: canvasLayer.y - Math.round(event.clientY - y)
      }
    });
  };

  private handleOnMouseUp = (
    _: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => {
    const { canvasLayers } = this.state;
    const canvasLayer = canvasLayers[index];

    if (canvasLayer.kind === CanvasLayerKind.base) {
      return;
    }

    this.setState({ isDragging: false });
  };
}

export default connect(
  () => ({}),
  () => ({})
)(Canvas);
