import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./Home";
import CreatePoint from "./CreatePoint";

const Router = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" exact />
    </BrowserRouter>
  );
};

export default Router;
