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
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../config/constants";

export const ThemeContext = createContext({
  setTheme: () => {},
});

export const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = useSelector(getIsUserLoggedIn);
  const loggedUserData = useSelector(getLoggedUserData);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeMenuOpen = (event) => {
    setThemeMenuAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchorEl(null);
  };

  const handleThemeChange = (theme) => {
    setTheme(theme);
    handleThemeMenuClose();
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
            cursor: "pointer",
          }}
          onClick={() => navigate(ROOT_PATH)}
        >
          Money Grid
        </Typography>

        {/* theme toggle */}
        <IconButton onClick={handleThemeMenuOpen} color="inherit">
          <ColorLensIcon />
        </IconButton>
        <Menu
          anchorEl={themeMenuAnchorEl}
          open={Boolean(themeMenuAnchorEl)}
          onClose={handleThemeMenuClose}
        >
          <MenuItem onClick={() => handleThemeChange("light")}>Light</MenuItem>
          <MenuItem onClick={() => handleThemeChange("dark")}>Dark</MenuItem>
          <MenuItem onClick={() => handleThemeChange("pink")}>Light Pink</MenuItem>
          <MenuItem onClick={() => handleThemeChange("darkPink")}>
            Dark Pink
          </MenuItem>
        </Menu>

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
