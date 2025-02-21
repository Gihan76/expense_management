import React, { createContext, useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getIsUserLoggedIn,
  getLoggedUserData,
  setIsUserLoggedIn,
} from "../../redux/slicers.js/dataSlice";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const ThemeContext = createContext({
  mode: "dark",
  toggleMode: () => {},
});

export const Header = () => {
  const dispatch = useDispatch();
  const { mode, toggleMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = useSelector(getIsUserLoggedIn);
  const loggedUserData = useSelector(getLoggedUserData);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    handleClose();
    await signOut(auth);
    dispatch(setIsUserLoggedIn(false));
    toast.success("Successfully Logged Out!", {
      autoClose: 1000,
    });
  };

  return (
    <AppBar
      position="static"
      enableColorOnDark
      style={{ height: "40px", justifyContent: "center" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          Money Grid
        </Typography>

        <IconButton onClick={toggleMode} color="inherit">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {isLoggedIn && (
          <div>
            <Tooltip title={loggedUserData?.email} placement="bottom">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};
