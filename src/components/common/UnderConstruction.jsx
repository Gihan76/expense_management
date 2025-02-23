import React from "react";
import {
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

export const UnderConstruction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
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
            marginBottom: theme.spacing(4),
          }}
        >
          <CircularProgress size={isMobile ? 60 : 80} />
        </Box>

        <Typography variant="h4" component="h1" color={theme.palette.mode === "light" ? "black" : "white"} fontWeight="bold" gutterBottom>
          Under Construction
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight="bold" gutterBottom>
          We're working hard to improve your experience, Please check back
          later.
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="bold">
          We appreciate your patience!
        </Typography>

        <Box
          sx={{
            marginTop: theme.spacing(4),
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            &copy; {new Date().getFullYear()} Money Grid. All rights
            reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
