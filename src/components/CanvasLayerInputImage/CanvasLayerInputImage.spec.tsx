import * as React from "react";
import * as ReactDOM from "react-dom";
import { CanvasLayerInputImage } from "./CanvasLayerInputImage";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<CanvasLayerInputImage onChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
