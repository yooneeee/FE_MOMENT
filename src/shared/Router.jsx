import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InitialPage from "../pages/InitialPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
