"use client"
import { darkTheme, lightTheme } from '@/utils/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import "./globals.css";
import { ThemeProvider, Switch, CssBaseline, FormControlLabel, Select, MenuItem, IconButton } from "@mui/material";

import StoreProvider from "@/store/StoreProvider";
import { StyledEngineProvider } from '@mui/material/styles';
import { ChangeEvent, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const pathName = usePathname()
  const [useDarkTheme, setUseDarkTheme] = useState(false);
  const [themes, setThemes] = useState(useDarkTheme ? darkTheme : lightTheme);

  const changeThemeHandler = (target: ChangeEvent, currentValue: boolean) => {
    setUseDarkTheme(currentValue);
    setThemes(currentValue ? darkTheme : lightTheme);
  };
  console.log(pathName)
  const LinkItems = [
    {
      href: '/',
      tabName: 'Send Money'
    },

    {
      href: '/instant-buy',
      tabName: 'Instant Buy/Sell'
    },
    {
      href: '#',
      tabName: 'DexPay'
    },
  ]

  return (
    <html lang="en">
      <ThemeProvider theme={themes}>
        <StoreProvider>
          <StyledEngineProvider injectFirst>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <body id="__next">
                <CssBaseline />
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                    <nav>
                      <ul className='list-none flex space-x-8 cursor-pointer'>
                        {LinkItems.map(el => {
                          return (
                            <li
                              onClick={() => router.push(el.href)}
                              key={el.tabName}
                              className={`p-4 border-0 ${pathName === el.href ? 'border-b-4 border-solid border-b-[#F92556]' : 'list-none'}`}>
                              {el.tabName}</li>
                          )
                        })}
                      </ul>
                    </nav>
                  </div>
                  <div className="flex items-center space-x-4">
                    <IconButton color="inherit">
                      {/* <Notifications /> */}
                    </IconButton>
                    <Select
                      value="BSC"
                      className="bg-gray-800 text-white"
                      sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.23)' } }}
                    >
                      <MenuItem value="BSC">BSC</MenuItem>
                    </Select>
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
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
                  </div>
                </header>

                <main className=" text-white max-h-screen">
                  {children}
                </main>
              </body>
            </AppRouterCacheProvider>
          </StyledEngineProvider>
        </StoreProvider>
      </ThemeProvider>
    </html>
  );
}
