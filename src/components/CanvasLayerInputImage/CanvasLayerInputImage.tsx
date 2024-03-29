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
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${(() => {
          return [
            "thumbnails/1.jpg",
            "thumbnails/2.jpg",
            "thumbnails/3.jpg",
            "thumbnails/4.jpg"
          ][Math.floor(Math.random() * 4)];
        })()})`
      }}
    ></div>
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
