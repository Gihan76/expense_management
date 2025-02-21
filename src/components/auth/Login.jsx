import React, { useState } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  setIsUserLoggedIn,
  setLoggedUserData,
} from "../../redux/slicers.js/dataSlice";
import { ForgotPasswordPopUp } from "./ForgotPasswordPopUp";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const Login = () => {
  const dispatch = useDispatch();
  const [isForgotPasswordPopUpOpen, setIsForgotPasswordPopUpOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      const toastId = toast.loading("Processing...");
      const { email, password, rememberMe } = values;
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      try {
        await setPersistence(auth, persistence);
        const authDetails = await signInWithEmailAndPassword(auth, email, password)
        dispatch(setIsUserLoggedIn(true));
        dispatch(setLoggedUserData(authDetails.user));
        toast.update(toastId, {
          render: "Successfully Signed In!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      } catch (error) {
        console.error("Error signing in:", error);
        toast.update(toastId, {
          render: "Error signing in, Please try again!",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const openForgotPasswordPopUp = () => {
    setIsForgotPasswordPopUpOpen(true);
  };

  const closeForgotPasswordPopUp = () => {
    setIsForgotPasswordPopUpOpen(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign in - Money Grid
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.rememberMe}
                name="rememberMe"
                onChange={formik.handleChange}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Sign In
          </Button>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={openForgotPasswordPopUp}
            sx={{ marginTop: 2 }}
            underline="none"
          >
            Forgot password?
          </Link>
        </form>
      </Paper>
      {isForgotPasswordPopUpOpen && (
        <ForgotPasswordPopUp
          open={isForgotPasswordPopUpOpen}
          onClose={closeForgotPasswordPopUp}
        />
      )}
    </Box>
  );
};
