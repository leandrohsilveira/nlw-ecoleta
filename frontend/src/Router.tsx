import React, { Suspense } from "react";
import { BrowserRouter, Route } from "react-router-dom";
const Loading = () => <div>Loading...</div>;

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
      <Route component={Home} path="/" exact />
      <Route component={CreatePoint} path="/create-point" exact />
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
