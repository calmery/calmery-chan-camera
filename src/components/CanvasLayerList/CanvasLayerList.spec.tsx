import * as React from "react";
import * as ReactDOM from "react-dom";
import { CanvasLayerList } from "./CanvasLayerList";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CanvasLayerList
      canvasLayers={[]}
      onSelect={() => {}}
      onRemove={() => {}}
      selectedIndex={0}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
