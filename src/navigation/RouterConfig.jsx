import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../components/auth/Login";
import { useSelector } from "react-redux";
import { getIsUserLoggedIn } from "../redux/slicers.js/dataSlice";
import { LandingPage } from "../components/landing/LandingPage";
import { EXPENSES_PATH, INVENTORY_PATH, LIST_EXPENSES_PATH, ROOT_PATH } from "../config/constants";
import { UnderConstruction } from "../components/common/UnderConstruction";
import { PageNotFound } from "../components/common/PageNotFound";
import LandingPageExpenses from "../components/expense/LandingPageExpenses";
import { ExpensesTable } from "../components/expense/ExpensesTable";
import { AddExpenseForm } from "../components/expense/AddExpenseForm";

export const RouterConfig = () => {
  const isLoggedIn = useSelector(getIsUserLoggedIn);

  return (
    <Routes>
      
      <Route path={ROOT_PATH} element={isLoggedIn ? <LandingPage /> : <Login />} />

      {/* expenses routes */}
      <Route path={EXPENSES_PATH} element={<LandingPageExpenses />} />
      <Route path={LIST_EXPENSES_PATH} element={<ExpensesTable />} />
      <Route path={`${LIST_EXPENSES_PATH}/create`} element={<AddExpenseForm />} />
      <Route path={`${LIST_EXPENSES_PATH}/:mode/:id`} element={<AddExpenseForm />} />

      {/* under construction route */}
      <Route path={INVENTORY_PATH} element={<UnderConstruction />} />
      {/* Page Not Found */}
      <Route path="*" element={<PageNotFound />} />

    </Routes>
  );
};