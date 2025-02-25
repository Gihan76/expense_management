import { Bounce, ToastContainer } from "react-toastify";
import { RouterConfig } from "./navigation/routerConfig";
import { Header, ThemeContext } from "./components/common/Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsUserLoggedIn,
  setIsUserLoggedIn,
  setLoggedUserData,
  setSettingsData,
} from "./redux/slicers.js/dataSlice";
import { auth } from "./config/firebase";
import { fetchConstants } from "./services/expenseServices";
import { ThemeProvider } from "@mui/material";
import "./App.css";
import themes from "./config/themeConfig";
import { BreadcrumbsComp } from "./components/common/BreadcrumbsComp";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsUserLoggedIn);
  const [theme, setTheme] = useState("dark");

  const themeContextValue = {
    theme,
    setTheme,
  };

  // handle login session
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setIsUserLoggedIn(true));
        dispatch(setLoggedUserData(user));
        const settings = await fetchConstants();
        dispatch(setSettingsData(settings));
      } else {
        dispatch(setIsUserLoggedIn(false));
      }
    });
  }, []);

  return (
    <ThemeProvider theme={themes[theme]}>
      <ThemeContext.Provider value={themeContextValue}>
        <div className="app-container">
          {isLoggedIn && <Header />}
          <BreadcrumbsComp />
          <RouterConfig />
        </div>
        <ToastContainer
          position="top-right"
          hideProgressBar={false}
          transition={Bounce}
          theme="light"
          closeOnClick
        />
      </ThemeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
