import * as React from "react";
import * as ReactDOM from "react-dom";
import CanvasLayerSelector from "./CanvasLayerSelector";
import { store } from "../../modules";
import { Provider } from "react-redux";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <CanvasLayerSelector onSelect={() => {}} />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
