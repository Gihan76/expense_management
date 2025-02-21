import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from "react-toastify";

export const ForgotPasswordPopUp = ({ open, onClose }) => {
  const [isBtnDisable, setIsBtnDisable] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsBtnDisable(true);
        const { email } = values;
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent successfully!", {
          autoClose: 2000,
        });
        onClose();
      } catch (error) {
        console.log("Error while sending forgot password:", error);
        toast.error("Error sending password reset email!", {
          autoClose: 2000,
        });
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" style={{ marginBottom: 16 }}>
            Enter your account's email address, and we'll send you a link to reset your password.
          </Typography>
          <TextField
            label="Email address"
            name="email"
            variant="outlined"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={isBtnDisable}
          >
            Continue
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};