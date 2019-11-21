import * as React from "react";
import styles from "./CanvasLayerExportButton.scss";

interface ICanvasLayerExportButtonProps {
  isExporting: boolean;
  onClick: () => void;
}

const CanvasLayerExportButton: React.FC<ICanvasLayerExportButtonProps> = ({
  isExporting,
  onClick
}) => (
  <div className={styles.container} onClick={onClick}>
    {isExporting ? "変換中..." : "画像を保存する！"}
  </div>
);

export { CanvasLayerExportButton };
