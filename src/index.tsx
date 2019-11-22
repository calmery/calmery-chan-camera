import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter as Router } from "connected-react-router";
import { store, history } from "./modules";
import * as serviceWorker from "./serviceWorker";
import "animate.css/animate.css";
import Top from "./pages/Top";

ReactGA.initialize("UA-153119606-1", {
  debug: process.env.NODE_ENV !== "production"
});

serviceWorker.register();

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Top} />
    <Redirect to="/" />
  </Switch>
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById("root")
);
