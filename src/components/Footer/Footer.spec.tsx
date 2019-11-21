import * as React from "react";
import * as ReactDOM from "react-dom";
import { Footer } from "./Footer";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Footer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
