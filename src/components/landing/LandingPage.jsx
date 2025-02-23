import { Box, CardActionArea, CardMedia, Grid2, Paper, Typography } from '@mui/material';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LANDING_TILES } from '../../config/constants';
import { ThemeContext } from '../common/Header';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);

  return (
    <Grid2 container spacing={3} justifyContent="center" sx={{ p: 3 }}>
      {LANDING_TILES.map((tile, index) => (
        <Grid2
          size={{ xs: 12, sm: 6 }}
          key={index}
        >
          <Paper sx={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.8)" }}>
            <CardActionArea onClick={() => navigate(tile.link)}>
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={tile.image}
                  alt={tile.title}
                  sx={{ filter: 'blur(3px)' }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    color={mode === "light" ? "white" : "black"}
                    sx={{
                      textShadow: mode === "light" ? "0 0 10px black, 0 0 20px black" : "0 0 10px white, 0 0 20px white",
                      fontWeight: "bold",
                    }}
                  >
                    {tile.title}
                  </Typography>
                </Box>
              </Box>
            </CardActionArea>
          </Paper>
        </Grid2>
      ))}
    </Grid2>
  );
}
