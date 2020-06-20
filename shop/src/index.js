import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import LoadingScreen from "./components/global-components/loading";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";
const RoutesController = lazy(() => import("./routes/routes"));
function saveToLocalStorage(state) {
  try {
    const serializeState = JSON.stringify(state);
    localStorage.setItem("shop-mern-state", serializeState);
  } catch (e) {
    console.log(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializeState = localStorage.getItem("shop-mern-state");
    if (serializeState === null) {
      return undefined;
    }
    return JSON.parse(serializeState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
const persistedState = loadFromLocalStorage();
const store = createStore(reducers, persistedState);

store.subscribe(() => saveToLocalStorage(store.getState()));
ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<LoadingScreen />}>
      <RoutesController />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);
