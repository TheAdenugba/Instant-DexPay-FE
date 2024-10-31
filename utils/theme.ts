'use client';
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        // primary: {
        //     main: '#0A0F19',
        // },
        background: { default: '#0A0F19' },
        text: { primary: '#fff' }
    },
});

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        // primary: {
        //     main: '#f3f4f7',
        // },
        background: { default: '#f3f4f7' },
        // text: { primary: '#000' }
    },
});


