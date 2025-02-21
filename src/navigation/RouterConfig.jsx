import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../components/auth/Login";
import { Expenses } from "../components/expense/Expenses";
import { useSelector } from "react-redux";
import { getIsUserLoggedIn } from "../redux/slicers.js/dataSlice";

export const RouterConfig = () => {
  const isLoggedIn = useSelector(getIsUserLoggedIn);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Expenses /> : <Login />} />
    </Routes>
  );
};