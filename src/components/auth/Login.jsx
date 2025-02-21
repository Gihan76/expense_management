import React from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {
  const { setIsLogged } = useAuth();

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
        await signInWithEmailAndPassword(auth, email, password);
        toast.update(toastId, {
          render: "Successfully Signed In!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        setIsLogged(true);
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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: "url(/images/login-bg.webp)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
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
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
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
            SIGN IN
          </Button>
          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 2, color: "primary", cursor: "pointer" }}
          >
            Forgot your password?
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};
