import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../components/auth/Login";
import { Expenses } from "../components/expense/Expenses";
import { useSelector } from "react-redux";
import { getIsUserLoggedIn } from "../redux/slicers.js/dataSlice";
import { LandingPage } from "../components/landing/LandingPage";
import { EXPENSES_PATH, INVENTORY_PATH, ROOT_PATH } from "../config/constants";
import { UnderConstruction } from "../components/common/UnderConstruction";

export const RouterConfig = () => {
  const isLoggedIn = useSelector(getIsUserLoggedIn);

  return (
    <Routes>
      <Route path={ROOT_PATH} element={isLoggedIn ? <LandingPage /> : <Login />} />
      <Route path={EXPENSES_PATH} element={<Expenses />} />
      <Route path={INVENTORY_PATH} element={<UnderConstruction />} />
    </Routes>
  );
};