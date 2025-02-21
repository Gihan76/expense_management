import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "../components/auth/Login";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config/firebase";
import { setSettingsData } from "../redux/slicers.js/dataSlice";
import { fetchConstants } from "../services/expenseServices";
import { Expenses } from "../components/expense/Expenses";

export const RouterConfig = () => {
  const dispatch = useDispatch();
  const { getIsLogged, setIsLogged, setLogOut } = useAuth();

  // handle current auth state
  useEffect(() => {
    (async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setIsLogged(true);

          // fetch constants
          const data = await fetchConstants();
          dispatch(setSettingsData(data));
        } else {
          setLogOut();
        }
      });
    })();
  }, []);

  return (
    <Routes>
      <Route path="/" element={getIsLogged() ? <Expenses /> : <Login />} />
    </Routes>
  );
};
