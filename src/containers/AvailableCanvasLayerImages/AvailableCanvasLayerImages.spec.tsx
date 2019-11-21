import * as React from "react";
import * as ReactDOM from "react-dom";
import { AvailableCanvasLayerImages } from "./AvailableCanvasLayerImages";
import { store } from "../../modules";
import { Provider } from "react-redux";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <AvailableCanvasLayerImages onSelect={() => {}} />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
