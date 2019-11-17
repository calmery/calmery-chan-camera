import * as React from "react";
import * as ReactDOM from "react-dom";
import Canvas from "./Canvas";
import { store } from "../../modules";
import { Provider } from "react-redux";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Provider store={store}>
      <Canvas />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
