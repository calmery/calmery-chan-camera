import * as React from "react";
import { connect } from "react-redux";
import { ICanvasLayer, CanvasLayerKind } from "../../types/CanvasLayer";
import CanvasLayer from "../../components/CanvasLayer";
import styles from "./Canvas.scss";
import CanvasLayerSelector from "../CanvasLayerSelector";
import CanvasLayerList from "../../components/CanvasLayerList";
import Modal from "../../components/Modal/Modal";

interface ICanvasState {
  isDragging: boolean;
  isOpenLayerMenu: boolean;
  selectedLayerIndex: number | null;
  offsetMousePosition: {
    x: number;
    y: number;
  };
  emphasisIndex: number;
  canvasLayers: ICanvasLayer[];
  exportedBase64: string | null;
}

class Canvas extends React.Component<{}, ICanvasState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isDragging: false,
      isOpenLayerMenu: false,
      selectedLayerIndex: null,
      emphasisIndex: -1,
      offsetMousePosition: {
        x: 0,
        y: 0
      },
      canvasLayers: [],
      exportedBase64: null
    };
  }

  // Refs

  private container: React.RefObject<HTMLDivElement> = React.createRef();
  private canvas: React.RefObject<SVGSVGElement> = React.createRef();

  // Life Cycles

  public componentDidMount = async () => {
    const canvasBaseLayer = await this.convertUrlToLayer(
      CanvasLayerKind.base,
      "images/background.jpg"
    );

    this.setState({
      ...this.state,
      canvasLayers: [canvasBaseLayer]
    });
  };

  // Render Functions

  public render = () => {
    const {
      canvasLayers,
      isOpenLayerMenu,
      emphasisIndex,
      exportedBase64
    } = this.state;
    const baseLayer = this.findBaseLayer();

    if (baseLayer === undefined) {
      return null;
    }

    return (
      <React.Fragment>
        <div className={styles.container} ref={this.container}>
          <svg
            ref={this.canvas}
            className={styles.svg}
            width={window.innerWidth - 48}
            height={
              (window.innerWidth - 48) / (baseLayer.width / baseLayer.height)
            }
            viewBox={`0 0 ${baseLayer.width} ${baseLayer.height}`}
            version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            onMouseMove={this.handleOnMouseMove}
            onTouchMove={this.handleOnMouseMove}
          >
            {canvasLayers.map(this.renderCanvasLayer)}
          </svg>
        </div>

        <div className={styles.inputs}>
          <div>
            <input
              type="file"
              multiple={false}
              onChange={this.handleOnChangeFile}
            />
          </div>
          <div>
            <input
              type="range"
              min="1"
              max="5"
              defaultValue="1"
              onChange={this.handleOnChangeScale}
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="359"
              defaultValue="0"
              onChange={this.handleOnChangeRotate}
            />
          </div>
          <div>
            <button onClick={this.handleOnClickExport}>export</button>
          </div>
        </div>

        <CanvasLayerList
          emphasisIndex={emphasisIndex}
          canvasLayers={canvasLayers}
          onClick={(emphasisIndex: number) => {
            this.setState({
              emphasisIndex,
              isOpenLayerMenu: emphasisIndex === -1
            });
          }}
        />

        {exportedBase64 !== null && (
          <div className={styles.exportedBase64}>
            <img src={exportedBase64} />
          </div>
        )}

        <Modal hidden={!isOpenLayerMenu}>
          <div
            className={styles.closeLayerMenuButton}
            onClick={() =>
              this.setState({ isOpenLayerMenu: false, emphasisIndex: -2 })
            }
          >
            û
          </div>
          <CanvasLayerSelector onSelect={this.handleOnClickAddLayer} />
        </Modal>
      </React.Fragment>
    );
  };

  private renderCanvasLayer = (canvasLayer: ICanvasLayer, index: number) => {
    return (
      <CanvasLayer
        key={index}
        {...canvasLayer}
        onMouseDown={event => this.handleOnMouseDown(event, index)}
        onMouseUp={event => this.handleOnMouseUp(event, index)}
        onClick={event => this.handleOnClick(event, index)}
      />
    );
  };

  // Event Handlers

  private handleOnChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files === null) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      async () => {
        let baseLayerIndex: number | null = null;
        const canvasLayers = this.state.canvasLayers;

        canvasLayers.forEach((canvasLayer, index) => {
          if (canvasLayer.kind === CanvasLayerKind.base) {
            baseLayerIndex = index;
          }
        });

        const nextBaseLayer = await this.convertUrlToLayer(
          CanvasLayerKind.base,
          reader.result as string
        );

        if (baseLayerIndex !== null) {
          canvasLayers[baseLayerIndex] = nextBaseLayer;
        } else {
          canvasLayers.push(nextBaseLayer);
        }

        this.setState({ canvasLayers });
      },
      false
    );

    reader.readAsDataURL(file);
  };

  private handleOnChangeScale = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { canvasLayers, emphasisIndex } = this.state;

    if (emphasisIndex < 0) {
      return;
    }

    const scale = parseInt(event.target.value, 10);
    const canvasLayer = canvasLayers[emphasisIndex!];

    canvasLayers[emphasisIndex!] = {
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
    const { canvasLayers, emphasisIndex } = this.state;

    if (emphasisIndex < 0) {
      return;
    }

    const canvasLayer = canvasLayers[emphasisIndex!];

    canvasLayers[emphasisIndex!] = {
      ...canvasLayer,
      effects: {
        ...canvasLayer.effects,
        rotate: parseInt(event.target.value, 10)
      }
    };

    this.setState({ canvasLayers });
  };

  private handleOnClickExport = () => {
    if (this.container.current === null) {
      return;
    }

    const svg = new Blob([this.container.current.innerHTML], {
      type: "image/svg+xml"
    });
    const url = URL.createObjectURL(svg);

    const image = new Image();

    image.onload = () => {
      const baseLayer = this.findBaseLayer()!;
      const canvas = document.createElement("canvas");
      canvas.width = baseLayer.width;
      canvas.height = baseLayer.height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return;
      }

      context.drawImage(image, 0, 0, baseLayer.width, baseLayer.height);
      this.setState({ exportedBase64: canvas.toDataURL() });
    };

    image.src = url;
  };

  private handleOnMouseMove = (
    event:
      | React.MouseEvent<SVGSVGElement, MouseEvent>
      | React.TouchEvent<SVGSVGElement>
  ) => {
    const {
      selectedLayerIndex,
      isDragging,
      canvasLayers,
      offsetMousePosition
    } = this.state;

    event.stopPropagation();

    if (!isDragging) {
      return;
    }

    const canvasLayer = canvasLayers[selectedLayerIndex!];

    if (this.canvas.current === null) {
      return;
    }

    const { x, y } = this.canvas.current.getBoundingClientRect() as DOMRect;
    const ratio = this.getRatio();

    let clientX;
    let clientY;

    if (Object.hasOwnProperty.call(event, "touches")) {
      clientX = (event as React.TouchEvent<SVGSVGElement>).touches[0].clientX;
      clientY = (event as React.TouchEvent<SVGSVGElement>).touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent<SVGSVGElement, MouseEvent>).clientX;
      clientY = (event as React.MouseEvent<SVGSVGElement, MouseEvent>).clientY;
    }

    canvasLayers[selectedLayerIndex!] = {
      ...canvasLayer,
      x: Math.round(clientX * ratio - x) + offsetMousePosition.x,
      y: Math.round(clientY * ratio - y) + offsetMousePosition.y
    };

    this.setState({ canvasLayers });
  };

  private handleOnClickAddLayer = async (url: string) => {
    this.setState({
      canvasLayers: [
        ...this.state.canvasLayers,
        await this.convertUrlToLayer(CanvasLayerKind.normal, url)
      ],
      emphasisIndex: this.state.canvasLayers.length,
      isOpenLayerMenu: false
    });
  };

  private handleOnMouseDown = (
    event:
      | React.MouseEvent<SVGImageElement, MouseEvent>
      | React.TouchEvent<SVGImageElement>,
    index: number
  ) => {
    const { canvasLayers } = this.state;
    const canvasLayer = canvasLayers[index];

    if (
      canvasLayer.kind === CanvasLayerKind.base ||
      this.canvas.current === null
    ) {
      return;
    }

    const { x, y } = this.canvas.current.getBoundingClientRect() as DOMRect;
    const ratio = this.getRatio();

    let clientX;
    let clientY;

    if (Object.hasOwnProperty.call(event, "touches")) {
      clientX = (event as React.TouchEvent<SVGImageElement>).touches[0].clientX;
      clientY = (event as React.TouchEvent<SVGImageElement>).touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent<SVGImageElement, MouseEvent>)
        .clientX;
      clientY = (event as React.MouseEvent<SVGImageElement, MouseEvent>)
        .clientY;
    }

    this.setState({
      isDragging: true,
      selectedLayerIndex: index,
      offsetMousePosition: {
        x: canvasLayer.x - Math.round(clientX * ratio - x),
        y: canvasLayer.y - Math.round(clientY * ratio - y)
      }
    });
  };

  private handleOnMouseUp = (
    _:
      | React.MouseEvent<SVGImageElement, MouseEvent>
      | React.TouchEvent<SVGImageElement>,
    index: number
  ) => {
    const { canvasLayers } = this.state;
    const canvasLayer = canvasLayers[index];

    if (canvasLayer.kind === CanvasLayerKind.base) {
      return;
    }

    this.setState({ selectedLayerIndex: null, isDragging: false });
  };

  private handleOnClick = (
    _: React.MouseEvent<SVGImageElement, MouseEvent>,
    index: number
  ) => {
    this.setState({ selectedLayerIndex: index });
  };

  // Helper Functions

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

  private findBaseLayer = (): ICanvasLayer | undefined => {
    const { canvasLayers } = this.state;
    return canvasLayers.find(({ kind }) => kind === CanvasLayerKind.base);
  };

  private convertDataUrlToBlob = (dataUrl: string) => {
    const type = dataUrl
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    const decodedData = atob(dataUrl.split(",")[1]);
    const buffer = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      buffer[i] = decodedData.charCodeAt(i);
    }
    return new Blob([buffer.buffer], { type });
  };

  private getRatio = () => {
    const baseLayer = this.findBaseLayer();

    if (!baseLayer) {
      return 0;
    }

    return baseLayer.width / (window.innerWidth - 48);
  };
}

export default connect(
  () => ({}),
  () => ({})
)(Canvas);
