import * as React from "react";
import * as ReactDOM from "react-dom";
import CanvasLayer from "./CanvasLayer";
import { CANVAS_LAYER_KIND } from "../../types/CanvasLayer";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CanvasLayer
      canvasLayer={{
        kind: CANVAS_LAYER_KIND.NORMAL,
        base64: "",
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        effects: {
          scale: 1,
          rotate: 0
        }
      }}
      onMouseDown={() => {}}
      onMouseUp={() => {}}
      onTouchStart={() => {}}
      onTouchEnd={() => {}}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
