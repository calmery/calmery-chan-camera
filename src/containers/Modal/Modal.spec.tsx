import * as React from "react";
import * as ReactDOM from "react-dom";
import { Modal } from "./Modal";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Modal onClose={() => {}}>Modal Component</Modal>, div);
  ReactDOM.unmountComponentAtNode(div);
});
