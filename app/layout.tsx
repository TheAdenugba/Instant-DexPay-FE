"use client";
import { Work_Sans } from 'next/font/google'
import { darkTheme, lightTheme } from "@/utils/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import "./globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import StoreProvider from "@/store/StoreProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactQueryClientProvider } from "@/utils/RectQueryClient";
import AppHeader from "@/components/AppHeader";

const workSans = Work_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const [useDarkTheme, setUseDarkTheme] = useState(true);
  const [themes, setThemes] = useState(useDarkTheme ? darkTheme : lightTheme);

  const changeThemeHandler = (target: ChangeEvent, currentValue: boolean) => {
    setUseDarkTheme(currentValue);
    setThemes(currentValue ? darkTheme : lightTheme);
  };
  const LinkItems = [
    {
      href: "/",
      tabName: "Send Money",
    },

    {
      href: "/instant-buy",
      tabName: "Instant Buy/Sell",
    },
    {
      href: "#",
      tabName: "DexPay",
    },
  ];

  return (
    <ReactQueryClientProvider>
      <html lang="en">
        <ThemeProvider theme={themes}>
          <StoreProvider>
            <StyledEngineProvider injectFirst>
              <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <body id="__next" className={workSans.className}>
                  <CssBaseline />
                  <AppHeader
                    LinkItems={LinkItems}
                    pathName={pathName}
                    useDarkTheme={useDarkTheme}
                    onChange={(target, value) => changeThemeHandler(target, value)}
                  />
                  <main className=" text-white max-h-screen">{children}</main>
                </body>
              </AppRouterCacheProvider>
            </StyledEngineProvider>
          </StoreProvider>
        </ThemeProvider>
      </html>
    </ReactQueryClientProvider>
  );
}
