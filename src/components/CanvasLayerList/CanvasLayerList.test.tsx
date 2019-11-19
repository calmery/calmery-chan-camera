import * as React from "react";
import * as ReactDOM from "react-dom";
import CanvasLayerList from "./CanvasLayerList";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CanvasLayerList canvasLayers={[]} emphasisIndex={0} onClick={() => {}} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
