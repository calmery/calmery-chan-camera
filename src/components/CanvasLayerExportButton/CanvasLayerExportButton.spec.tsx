import * as React from "react";
import * as ReactDOM from "react-dom";
import { CanvasLayerExportButton } from "./CanvasLayerExportButton";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CanvasLayerExportButton isExporting={false} onClick={() => {}} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
