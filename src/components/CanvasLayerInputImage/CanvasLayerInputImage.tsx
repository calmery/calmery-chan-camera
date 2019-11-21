import * as React from "react";
import blueimpLoadImage from "blueimp-load-image";
import styles from "./CanvasLayerInputImage.scss";

interface ICanvasLayerInputImageProps {
  onChange: (dataUrl: string) => void;
}

const CanvasLayerInputImage: React.FC<ICanvasLayerInputImageProps> = ({
  onChange
}) => (
  <div className={styles.container}>
    <div className={styles.background}></div>
    <div className={styles.message}>クリック、タップして画像を読み込む</div>
    <input
      type="file"
      multiple={false}
      className={styles.input}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files === null) {
          return;
        }
        const file = files[0];

        blueimpLoadImage(
          file,
          async canvas => {
            onChange((canvas as HTMLCanvasElement).toDataURL());
          },
          { canvas: true, orientation: true }
        );
      }}
      accept="image/*"
    />
  </div>
);

export { CanvasLayerInputImage };
