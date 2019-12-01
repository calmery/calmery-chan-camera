import * as React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { ICanvasLayer, CANVAS_LAYER_KIND } from "../../types/CanvasLayer";
import { CanvasLayer } from "../../components/CanvasLayer";
import styles from "./Canvas.scss";
import { CanvasLayerList } from "../../components/CanvasLayerList";
import { Modal } from "../Modal";
import { AvailableCanvasLayerImages } from "../AvailableCanvasLayerImages";
import { CanvasLayerExportButton } from "../../components/CanvasLayerExportButton";
import { CanvasLayerInputImage } from "../../components/CanvasLayerInputImage";
import { ErrorMessage } from "../../containers/ErrorMessage";
import {
  download,
  convertSvgToDataUrl,
  convertUrlToLayer,
  sendToGA
} from "../../helpers";
import {
  GOOGLE_ANALYTICS,
  GOOGLE_ANALYTICS_ACTION
} from "../../types/GoogleAnalytics";

interface ICanvasState {
  isDraggingCanvasLayer: boolean;
  isOpenAvailableCanvasLayerImages: boolean;
  isOpenInformation: boolean;
  selectedCanvasLayerIndex: number;
  offsetMousePosition: {
    x: number;
    y: number;
  };
  canvasLogo: ICanvasLayer | null;
  canvasLayers: ICanvasLayer[];
  isExportError: boolean;
  isExporting: boolean;
  alreadySetEvents: boolean;
  errorMessage: string | null;
}

class Canvas extends React.Component<{}, ICanvasState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      alreadySetEvents: false,
      isDraggingCanvasLayer: false,
      isOpenInformation: false,
      isOpenAvailableCanvasLayerImages: false,
      selectedCanvasLayerIndex: -1,
      isExportError: false,
      canvasLogo: null,
      offsetMousePosition: {
        x: 0,
        y: 0
      },
      canvasLayers: [],
      isExporting: false,
      errorMessage: null
    };
  }

  // Refs

  private container: React.RefObject<HTMLDivElement> = React.createRef();
  private canvas: React.RefObject<SVGSVGElement> = React.createRef();

  public componentDidMount = async () => {
    this.setState({
      canvasLogo: await convertUrlToLayer(
        CANVAS_LAYER_KIND.LOGO,
        "images/canvas-logo.png"
      )
    });
  };

  public componentDidUpdate = () => {
    // React の onMouseMove や onTouchMove には passive オプションを渡すことができない
    if (!this.state.alreadySetEvents && this.canvas.current !== null) {
      this.canvas.current.addEventListener(
        "mousemove",
        this.handleOnMouseMove,
        { passive: false }
      );
      this.canvas.current.addEventListener(
        "touchmove",
        this.handleOnMouseMove,
        { passive: false }
      );
      this.setState({ alreadySetEvents: true });
    }
  };

  public componentWillUnmount = () => {
    if (this.canvas.current) {
      this.canvas.current.removeEventListener(
        "mousemove",
        this.handleOnMouseMove
      );
      this.canvas.current.removeEventListener(
        "touchmove",
        this.handleOnMouseMove
      );
    }
  };

  // Render Functions

  public render = () => {
    const {
      errorMessage,
      canvasLayers,
      isOpenAvailableCanvasLayerImages,
      selectedCanvasLayerIndex,
      isOpenInformation,
      canvasLogo
    } = this.state;
    const baseLayer = this.findBaseLayer();

    if (baseLayer === undefined) {
      return (
        <React.Fragment>
          <CanvasLayerInputImage onChange={this.handleOnChangeFile} />
          <ErrorMessage
            hidden={errorMessage === null}
            onClick={() => {
              this.setState({ errorMessage: null });
            }}
          >
            {errorMessage}
          </ErrorMessage>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className={styles.parentFlex}>
          <div
            className={classnames(styles.container, styles.canvasElements)}
            ref={this.container}
          >
            <svg
              ref={this.canvas}
              className={styles.svg}
              width={window.innerWidth - 48}
              // height={
              //   (window.innerWidth - 48) / (baseLayer.width / baseLayer.height)
              // }
              viewBox={`0 0 ${baseLayer.width} ${baseLayer.height}`}
              version="1.1"
              baseProfile="full"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              {canvasLayers.map(this.renderCanvasLayer)}
              {canvasLogo &&
                this.renderCanvasLayer(
                  {
                    ...canvasLogo,
                    width:
                      baseLayer.width / 3 < 209 ? 209 : baseLayer.width / 3,
                    height:
                      175 /
                      (1000 /
                        (baseLayer.width / 3 < 209
                          ? 209
                          : baseLayer.width / 3)),
                    x:
                      baseLayer.width -
                      (baseLayer.width / 3 < 209 ? 209 : baseLayer.width / 3) -
                      24,
                    y:
                      baseLayer.height -
                      175 /
                        (1000 /
                          (baseLayer.width / 3 < 209
                            ? 209
                            : baseLayer.width / 3)) -
                      24
                  },
                  -1
                )}
            </svg>
          </div>

          <div className={styles.editorElements}>
            <div className={styles.PCReverse}>
              <div className={styles.renderInputs}>
                {this.renderInputs(
                  selectedCanvasLayerIndex < 0,
                  selectedCanvasLayerIndex < 0
                    ? 1
                    : canvasLayers[selectedCanvasLayerIndex].effects.scale,
                  selectedCanvasLayerIndex < 0
                    ? 0
                    : canvasLayers[selectedCanvasLayerIndex].effects.rotate
                )}
              </div>

              <CanvasLayerList
                canvasLayers={canvasLayers}
                selectedIndex={selectedCanvasLayerIndex}
                onSelect={this.handleOnSelectCanvasLayer}
                onRemove={this.handleOnRemoveCanvasLayer}
              />
            </div>

            <CanvasLayerExportButton
              isExporting={this.state.isExporting}
              onClick={this.handleOnExport}
            />
          </div>

          <ErrorMessage
            hidden={errorMessage === null}
            onClick={() => {
              this.setState({ errorMessage: null });
            }}
          >
            {errorMessage}
          </ErrorMessage>
        </div>

        <Modal
          hidden={!isOpenAvailableCanvasLayerImages}
          onClose={() => {
            this.setState({ isOpenAvailableCanvasLayerImages: false });
          }}
        >
          <div
            className={styles.closeAvailableCanvasLayerImagesButton}
            onClick={this.handleOnCloseAvailableCanvasLayerImages}
          >
            <img src="images/arrow.svg" alt="閉じる" />
          </div>
          <AvailableCanvasLayerImages onSelect={this.handleOnAddCanvasLayer} />
        </Modal>
      </React.Fragment>
    );
  };

  private renderInputs = (disabled: boolean, scale: number, rotate: number) => (
    <div
      className={classnames(styles.inputs, {
        [styles.disabled]: disabled
      })}
    >
      <div>
        <input
          id="canvas-checkbox-flip"
          type="checkbox"
          disabled={disabled}
          onChange={this.handleOnChangeFlip}
        />
        <label htmlFor="canvas-checkbox-flip">レイヤーを左右反転する</label>
      </div>
      <div>
        <div>
          <img src="images/scale.svg" alt="拡大縮小" />
        </div>
        <div className={styles.fixedHeight}>
          <input
            className={styles.inputRange}
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={scale}
            disabled={disabled}
            onChange={this.handleOnChangeScale}
          />
        </div>
      </div>
      <div>
        <div>
          <img src="images/rotate.svg" alt="回転" />
        </div>
        <div className={styles.fixedHeight}>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="359"
            disabled={disabled}
            value={rotate}
            onChange={this.handleOnChangeRotate}
          />
        </div>
      </div>
    </div>
  );

  private renderCanvasLayer = (canvasLayer: ICanvasLayer, index: number) => {
    return (
      <CanvasLayer
        key={index}
        canvasLayer={canvasLayer}
        onMouseDown={event => this.handleOnMouseDown(event, index)}
        onMouseUp={event => this.handleOnMouseUp(event, index)}
        onTouchStart={event => this.handleOnMouseDown(event, index)}
        onTouchEnd={event => this.handleOnMouseUp(event, index)}
      />
    );
  };

  // Event Handlers

  private handleOnChangeFlip = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { canvasLayers, selectedCanvasLayerIndex } = this.state;

    if (selectedCanvasLayerIndex < 0) {
      return;
    }

    const canvasLayer = canvasLayers[selectedCanvasLayerIndex];
    const checked = event.target.checked;

    canvasLayers[selectedCanvasLayerIndex] = {
      ...canvasLayer,
      x: (() => {
        if (canvasLayer.effects.flip === -1) {
          return canvasLayer.x - canvasLayer.width * canvasLayer.effects.scale;
        } else {
          return canvasLayer.x + canvasLayer.width * canvasLayer.effects.scale;
        }
      })(),
      effects: {
        ...canvasLayer.effects,
        flip: checked ? -1 : 1
      }
    };

    this.setState({ canvasLayers });
  };

  private handleOnChangeScale = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { canvasLayers, selectedCanvasLayerIndex } = this.state;

    if (selectedCanvasLayerIndex < 0) {
      return;
    }

    const scale = parseFloat(event.target.value);
    const canvasLayer = canvasLayers[selectedCanvasLayerIndex];

    canvasLayers[selectedCanvasLayerIndex] = {
      ...canvasLayer,
      x:
        canvasLayer.x +
        ((canvasLayer.width * canvasLayer.effects.scale -
          canvasLayer.width * scale) /
          2) *
          canvasLayer.effects.flip,
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
    const { canvasLayers, selectedCanvasLayerIndex } = this.state;

    if (selectedCanvasLayerIndex < 0) {
      return;
    }

    const canvasLayer = canvasLayers[selectedCanvasLayerIndex];

    canvasLayers[selectedCanvasLayerIndex] = {
      ...canvasLayer,
      effects: {
        ...canvasLayer.effects,
        rotate: parseInt(event.target.value, 10)
      }
    };

    this.setState({ canvasLayers });
  };

  private handleOnMouseMove = (event: MouseEvent | TouchEvent) => {
    const {
      selectedCanvasLayerIndex,
      isDraggingCanvasLayer,
      canvasLayers,
      offsetMousePosition
    } = this.state;

    event.preventDefault();
    event.stopPropagation();

    if (!isDraggingCanvasLayer) {
      return;
    }

    const canvasLayer = canvasLayers[selectedCanvasLayerIndex];

    if (this.canvas.current === null) {
      return;
    }

    const { x, y } = this.canvas.current.getBoundingClientRect() as DOMRect;
    const ratio = this.getRatio();

    let clientX;
    let clientY;

    // TODO: mousemove と touchmove を同じメソッドで扱っているのが良くない
    try {
      clientX = (event as TouchEvent).touches[0].clientX;
      clientY = (event as TouchEvent).touches[0].clientY;
    } catch (_) {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    canvasLayers[selectedCanvasLayerIndex] = {
      ...canvasLayer,
      x: Math.round(clientX * ratio - x) + offsetMousePosition.x,
      y: Math.round(clientY * ratio - y) + offsetMousePosition.y
    };

    this.setState({ canvasLayers });
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
      canvasLayer.kind === CANVAS_LAYER_KIND.BASE ||
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
      isDraggingCanvasLayer: true,
      selectedCanvasLayerIndex: index,
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

    if (canvasLayer.kind === CANVAS_LAYER_KIND.BASE) {
      return;
    }

    this.setState({
      isDraggingCanvasLayer: false
    });
  };

  // Helper Functions

  private findBaseLayer = (): ICanvasLayer | undefined => {
    const { canvasLayers } = this.state;
    return canvasLayers.find(({ kind }) => kind === CANVAS_LAYER_KIND.BASE);
  };

  private getRatio = () => {
    const baseLayer = this.findBaseLayer();

    if (baseLayer === undefined || this.canvas.current === null) {
      return 1;
    }

    return baseLayer.width / this.canvas.current.getBoundingClientRect().width;
  };

  // Events

  private handleOnExport = () => {
    this.setState({ isExporting: true }, async () => {
      if (this.container.current === null) {
        return;
      }

      try {
        const { width, height } = this.findBaseLayer()!;
        const dataUrl = await convertSvgToDataUrl(
          this.container.current.innerHTML,
          width,
          height
        );
        download("calmery.png", dataUrl);
        this.setState({ isExporting: false });
        sendToGA(
          GOOGLE_ANALYTICS.CANVAS,
          GOOGLE_ANALYTICS_ACTION.CANVAS_EXPORT
        );
      } catch (errorMessage) {
        this.setState({
          isExporting: false,
          isExportError: true,
          errorMessage
        });
      }
    });
  };

  private handleOnSelectCanvasLayer = (selectedCanvasLayerIndex: number) => {
    this.setState({
      selectedCanvasLayerIndex,
      isOpenAvailableCanvasLayerImages: selectedCanvasLayerIndex === -1
    });
  };

  private handleOnRemoveCanvasLayer = (selectedCanvasLayerIndex: number) => {
    const { canvasLayers } = this.state;

    const canvasLayer = canvasLayers[selectedCanvasLayerIndex];
    sendToGA(
      GOOGLE_ANALYTICS.CANVAS,
      GOOGLE_ANALYTICS_ACTION.CANVAS_NORMAL_LAYER_ADD,
      (() => {
        if (canvasLayer.id) {
          return canvasLayer.id.toString();
        }
      })(),
      canvasLayer.id
    );

    this.setState({
      selectedCanvasLayerIndex: -1,
      canvasLayers: canvasLayers.filter(
        (_, index) => selectedCanvasLayerIndex !== index
      )
    });
  };

  private handleOnChangeFile = async (dataUrl: string) => {
    const { canvasLayers } = this.state;
    let baseLayerIndex: number | null = null;

    canvasLayers.forEach((canvasLayer, index) => {
      if (canvasLayer.kind === CANVAS_LAYER_KIND.BASE) {
        baseLayerIndex = index;
      }
    });

    try {
      const nextBaseLayer = await convertUrlToLayer(
        CANVAS_LAYER_KIND.BASE,
        dataUrl
      );

      if (baseLayerIndex !== null) {
        canvasLayers[baseLayerIndex] = nextBaseLayer;
      } else {
        canvasLayers.push(nextBaseLayer);
      }

      sendToGA(
        GOOGLE_ANALYTICS.CANVAS,
        GOOGLE_ANALYTICS_ACTION.CANVAS_BASE_LAYER_ADD
      );
      this.setState({ canvasLayers });
    } catch (errorMessage) {
      this.setState({ errorMessage });
    }
  };

  private handleOnAddCanvasLayer = async (url: string, id: number) => {
    const { canvasLayers } = this.state;

    const canvasLayer = await convertUrlToLayer(
      CANVAS_LAYER_KIND.NORMAL,
      url,
      id
    );
    sendToGA(
      GOOGLE_ANALYTICS.CANVAS,
      GOOGLE_ANALYTICS_ACTION.CANVAS_NORMAL_LAYER_ADD,
      id.toString(),
      id
    );

    this.setState({
      canvasLayers: [...canvasLayers, canvasLayer],
      selectedCanvasLayerIndex: canvasLayers.length,
      isOpenAvailableCanvasLayerImages: false
    });
  };

  private handleOnCloseAvailableCanvasLayerImages = () => {
    this.setState({
      isOpenAvailableCanvasLayerImages: false,
      selectedCanvasLayerIndex: -2
    });
  };
}

export default connect(
  () => ({}),
  () => ({})
)(Canvas);
