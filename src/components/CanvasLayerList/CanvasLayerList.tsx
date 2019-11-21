import * as React from "react";
import classnames from "classnames";
import { CanvasLayerListElement } from "../CanvasLayerListElement";
import { ICanvasLayer, CANVAS_LAYER_KIND } from "../../types/CanvasLayer";
import styles from "./CanvasLayerList.scss";

interface ICanvasLayerListProps {
  canvasLayers: ICanvasLayer[];
  selectedIndex: number;
  onSelect: (nextSelectedIndex: number) => void;
  onRemove: (selectedIndex: number) => void;
}

const CanvasLayerList: React.FC<ICanvasLayerListProps> = ({
  canvasLayers,
  selectedIndex,
  onSelect,
  onRemove
}) => {
  console.log(selectedIndex);
  return (
    <div className={styles.container}>
      {canvasLayers.map((canvasLayer, currentIndex) =>
        canvasLayer.kind === CANVAS_LAYER_KIND.BASE ? null : (
          <CanvasLayerListElement
            key={currentIndex}
            active={selectedIndex === currentIndex}
            canvasLayer={canvasLayer}
            onSelect={() => onSelect(currentIndex)}
            onRemove={() => onRemove(currentIndex)}
          />
        )
      )}
      <div className={styles.canvasLayerContainer} onClick={() => onSelect(-1)}>
        <div
          className={classnames(styles.canvasLayer, styles.addButton, {
            [styles.emphasis]: selectedIndex === -1
          })}
        >
          ï
        </div>
      </div>
    </div>
  );
};

export { CanvasLayerList };
