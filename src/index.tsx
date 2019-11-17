import * as React from "react";
import * as ReactDOM from "react-dom";
import { Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter as Router } from "connected-react-router";
import { createGlobalStyle } from "styled-components";
import { store, history } from "./modules";
import * as serviceWorker from "./serviceWorker";
import Top from "./pages/Top";

serviceWorker.register();

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Top} />
    <Redirect to="/" />
  </Switch>
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <GlobalStyle />
      <Routes />
    </Router>
  </Provider>,
  document.getElementById("root")
);
