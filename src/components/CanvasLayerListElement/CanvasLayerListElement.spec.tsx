import * as React from "react";
import * as ReactDOM from "react-dom";
import { CanvasLayerListElement } from "./CanvasLayerListElement";
import { CANVAS_LAYER_KIND } from "../../types/CanvasLayer";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CanvasLayerListElement
      active={false}
      canvasLayer={{
        kind: CANVAS_LAYER_KIND.BASE,
        base64: "",
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        effects: {
          scale: 1,
          rotate: 0
        }
      }}
      onSelect={() => {}}
      onRemove={() => {}}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
