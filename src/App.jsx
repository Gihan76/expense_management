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
import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsUserLoggedIn);
  const [mode, setMode] = useState("dark");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const themeContextValue = {
    mode,
    toggleMode,
  };

  const theme = createTheme({
    palette: {
      mode,
    },
  });

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
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={themeContextValue}>
        <div className="app-container">
          {isLoggedIn && <Header />}
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
