import * as React from "react";
import classnames from "classnames";
import { ICanvasLayer } from "../../types/CanvasLayer";
import styles from "./CanvasLayerListElement.scss";

interface ICanvasLayerListElementProps {
  active: boolean;
  canvasLayer: ICanvasLayer;
  onSelect: () => void;
  onRemove: () => void;
}

const CanvasLayerListElement: React.FC<ICanvasLayerListElementProps> = ({
  active,
  canvasLayer: { base64 },
  onSelect,
  onRemove
}) => {
  return (
    <div className={styles.container}>
      <div
        className={classnames(styles.canvasLayer, {
          [styles.emphasis]: active
        })}
        onClick={onSelect}
      >
        <div
          className={classnames(styles.removeButton, {
            [styles.display]: active
          })}
          onClick={event => {
            event.stopPropagation();
            onRemove();
          }}
        >
          <img src="images/close.svg" alt="閉じる" />
        </div>
        <div className={styles.imageContainer}>
          <img src={base64} alt="追加する画像" />
        </div>
      </div>
    </div>
  );
};

export { CanvasLayerListElement };
