import * as React from "react";
import * as ReactDOM from "react-dom";
import CanvasLayer from "./CanvasLayer";
import { CanvasLayerKind } from "../../types/CanvasLayer";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <CanvasLayer
      kind={CanvasLayerKind.normal}
      base64=""
      width={0}
      height={0}
      x={0}
      y={0}
      effects={{
        scale: 1,
        rotate: 0
      }}
      onMouseDown={() => {}}
      onMouseUp={() => {}}
      onClick={() => {}}
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
