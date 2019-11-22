import * as React from "react";
import * as ReactDOM from "react-dom";
import { ErrorMessage } from "./ErrorMessage";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <ErrorMessage onClick={() => {}}>Modal Component</ErrorMessage>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
