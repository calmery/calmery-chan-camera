import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactGA from "react-ga";
import * as Sentry from "@sentry/browser";
import { Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter as Router } from "connected-react-router";
import { store, history } from "./modules";
import "animate.css/animate.css";
import Top from "./pages/Top";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://69015ac1a388461b9267b07ef2f9f96d@sentry.io/1830950"
  });
}

ReactGA.initialize("UA-153119606-1", {
  debug: process.env.NODE_ENV !== "production"
});

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
