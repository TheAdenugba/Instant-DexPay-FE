'use client';
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        // primary: {
        //     main: '#ff4d4d',
        // },
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: "light",
    },
});


