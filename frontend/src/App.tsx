import React from "react";
import { applyConfigurations } from "ecoleta-core";
import "./App.css";
import Router from "./pages/Router";
import config from "./config";

applyConfigurations(config);

function App() {
  return (
    <>
      <Router />
    </>
  );
}

export default App;
