"use client"

import { darkTheme, lightTheme } from '@/utils/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import "./globals.css";
import { ThemeProvider, Switch, CssBaseline, FormControlLabel } from "@mui/material";

import StoreProvider from "@/store/StoreProvider";
import { StyledEngineProvider } from '@mui/material/styles';
import { ChangeEvent, useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [useDarkTheme, setUseDarkTheme] = useState(false);
  const [themes, setThemes] = useState(useDarkTheme ? darkTheme : lightTheme);

  const changeThemeHandler = (target: ChangeEvent, currentValue: boolean) => {
    setUseDarkTheme(currentValue);
    setThemes(currentValue ? darkTheme : lightTheme);
  };

  return (
    <html lang="en">
      <ThemeProvider theme={themes}>
        <StoreProvider>
          <StyledEngineProvider injectFirst>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <body id="__next">
                <CssBaseline />
                <div className=''>header</div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useDarkTheme}
                      inputProps={{ "aria-label": "Dark Mode" }}
                      onChange={(target, value) => changeThemeHandler(target, value)}
                    ></Switch>
                  }
                  label="Dark Mode"
                  labelPlacement="start"
                />
                {children}
              </body>
            </AppRouterCacheProvider>
          </StyledEngineProvider>
        </StoreProvider>
      </ThemeProvider>
    </html>
  );
}
