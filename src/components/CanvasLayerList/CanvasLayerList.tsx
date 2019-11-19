import * as React from "react";
import classnames from "classnames";
import { ICanvasLayer, CanvasLayerKind } from "../../types/CanvasLayer";
import styles from "./CanvasLayerList.scss";

interface ICanvasLayerListProps {
  canvasLayers: ICanvasLayer[];
  emphasisIndex: number;
  onClick: (emphasisIndex: number) => void;
}

const CanvasLayerList: React.FC<ICanvasLayerListProps> = ({
  canvasLayers,
  emphasisIndex,
  onClick
}) => {
  return (
    <div className={styles.container}>
      {canvasLayers.map((canvasLayer, currentIndex) => {
        const { base64 } = canvasLayer;

        if (canvasLayer.kind === CanvasLayerKind.base) {
          return null;
        }

        return (
          <div className={styles.canvasLayerContainer}>
            <div
              className={classnames(styles.canvasLayer, {
                [styles.emphasis]: currentIndex === emphasisIndex
              })}
              key={currentIndex}
              onClick={() => onClick(currentIndex)}
            >
              <img src={base64} />
            </div>
          </div>
        );
      })}
      <div className={styles.canvasLayerContainer} onClick={() => onClick(-1)}>
        <div
          className={classnames(styles.canvasLayer, styles.addButton, {
            [styles.emphasis]: emphasisIndex === -1
          })}
        >
          ï
        </div>
      </div>
    </div>
  );
};

export default CanvasLayerList;
