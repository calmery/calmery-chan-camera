import * as React from "react";
import styles from "./AvailableCanvasLayerImages.scss";

interface IAvailableCanvasLayerImagesProps {
  onSelect: (url: string, index: number) => void;
}

interface IAvailableCanvasLayerImagesState {
  isFetchError: boolean;
  availableCanvasLayerUrls: string[];
}

class AvailableCanvasLayerImages extends React.Component<
  IAvailableCanvasLayerImagesProps,
  IAvailableCanvasLayerImagesState
> {
  constructor(props: IAvailableCanvasLayerImagesProps) {
    super(props);

    this.state = {
      isFetchError: false,
      availableCanvasLayerUrls: []
    };
  }

  public componentDidMount = () => this.getAvailableCanvasLayerUrls();

  // Render

  public render = () => {
    const { onSelect } = this.props;
    const { isFetchError, availableCanvasLayerUrls } = this.state;

    if (isFetchError) {
      return (
        <div className={styles.errorContainer}>
          <div>
            <img src="images/help.png" />
            <div className={styles.errorMessage}>読み込みに失敗しました！</div>
            <div
              className={styles.reloadButton}
              onClick={this.getAvailableCanvasLayerUrls}
            >
              再読み込みする
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {availableCanvasLayerUrls.map((availableCanvasLayerUrl, index) => (
          <img
            key={index}
            src={availableCanvasLayerUrl}
            onClick={() => onSelect(availableCanvasLayerUrl, index + 1)}
          />
        ))}
      </div>
    );
  };

  // Helper Functions

  private getAvailableCanvasLayerUrls = async () => {
    try {
      this.setState({
        isFetchError: false,
        availableCanvasLayerUrls: await fetch("layers.json").then(response =>
          response.json()
        )
      });
    } catch (_) {
      this.setState({ isFetchError: true });
    }
  };
}

export { AvailableCanvasLayerImages };
