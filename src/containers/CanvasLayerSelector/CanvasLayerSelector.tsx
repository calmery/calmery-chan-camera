import * as React from "react";
import styles from "./CanvasLayerSelector.scss";

interface CanvasLayerSelectorProps {
  onSelect: (url: string) => void;
}

interface CanvasLayerSelectorState {
  isError: boolean;
  layerImageUrls: string[];
}

class CanvasLayerSelector extends React.Component<
  CanvasLayerSelectorProps,
  CanvasLayerSelectorState
> {
  constructor(props: CanvasLayerSelectorProps) {
    super(props);

    this.state = {
      isError: true,
      layerImageUrls: []
    };
  }

  public componentDidMount = () => this.getLayerImageUrls();

  public render = () => {
    const { onSelect } = this.props;
    const { isError, layerImageUrls } = this.state;

    if (isError) {
      return (
        <div className={styles.errorContainer}>
          <div>
            <div className={styles.errorMessage}>読み込みに失敗しました</div>
            <button onClick={this.handleOnClickReloadButton}>
              再読み込みする
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {layerImageUrls.map((layerImageUrl, index) => {
          return (
            <img
              src={layerImageUrl}
              key={index}
              onClick={() => onSelect(layerImageUrl)}
            />
          );
        })}
      </div>
    );
  };

  // Events

  private handleOnClickReloadButton = () => this.getLayerImageUrls();

  // Helper Functions

  private getLayerImageUrls = async () => {
    try {
      this.setState({
        isError: false,
        layerImageUrls: await fetch("layers.json").then(response =>
          response.json()
        )
      });
    } catch (_) {
      this.setState({ isError: true });
    }
  };
}

export default CanvasLayerSelector;
