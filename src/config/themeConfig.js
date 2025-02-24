import { createTheme } from '@mui/material/styles';

const themes = {
    light: createTheme({
        palette: {
            mode: 'light',
            primary: { main: '#1976d2' }, // Default blue
            secondary: { main: '#9c27b0' }, // Default purple
        },
    }),
    dark: createTheme({
        palette: {
            mode: 'dark',
            primary: { main: '#90caf9' },
            secondary: { main: '#ce93d8' },
        },
    }),
    pink: createTheme({
        palette: {
            mode: 'light',
            primary: { main: '#e91e63' }, // Pink
            secondary: { main: '#f06292' }, // Lighter pink
            background: {
                default: '#fce4ec', // Light pink background
            },
        },
    }),
    darkPink: createTheme({
        palette: {
            mode: 'dark',
            primary: { main: '#f48fb1' },
            secondary: { main: '#ce93d8' },
            background: {
                default: '#280a18'
            }
        }
    })
};

export default themes;