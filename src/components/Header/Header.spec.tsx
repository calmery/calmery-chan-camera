import * as React from "react";
import * as ReactDOM from "react-dom";
import { Header } from "./Header";

it("Renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Header onClickInfomrationButton={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
