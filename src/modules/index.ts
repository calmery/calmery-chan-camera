import {
  routerMiddleware,
  connectRouter,
  RouterState
} from "connected-react-router";
import { createBrowserHistory } from "history";
import { createStore, combineReducers, applyMiddleware } from "redux";

import counter, { CounterState } from "./counter/reducer";

export const history = createBrowserHistory({
  basename: document.baseURI.replace(window.location.origin, "")
});
const middleware = routerMiddleware(history);

export interface State {
  counter: CounterState;
  router: RouterState;
}

export const store = createStore(
  combineReducers({
    counter,
    router: connectRouter(history)
  }),
  applyMiddleware(middleware)
);
