import {
  useTheme,
  Typography,
  Box,
  Button,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../config/constants";

export const PageNotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROOT_PATH);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing(4),
      }}
    >
      <Box
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
          padding: theme.spacing(4),
          borderRadius: theme.shape.borderRadius,
          maxWidth: "md",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color={theme.palette.mode === "light" ? "black" : "white"}
          >
            404 - Not Found
          </Typography>
        </Box>

        <Typography
          variant="body1"
          component="p"
          fontWeight="bold"
          color="text.secondary"
          gutterBottom
        >
          Oops! It seems you've stumbled upon a page that doesn't exist or you
          don't have permission to view.
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color="text.secondary"
          fontWeight="bold"
        >
          Please check the URL or contact support if you believe this is an
          error.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};
