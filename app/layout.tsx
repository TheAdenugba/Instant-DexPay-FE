"use client";
import { Work_Sans } from "next/font/google";
import { darkTheme, lightTheme } from "@/utils/theme";
import { DynamicContextProvider, FilterChain, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { http } from "viem";
import { bscTestnet, bsc } from "viem/chains";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import "./globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
// import StoreProvider from "@/store/StoreeProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { ReactQueryClientProvider } from "@/utils/RectQueryClient";
import AppHeader from "@/components/AppHeader";
import { EthereumIcon, SolanaIcon } from "@dynamic-labs/iconic";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";
import { ToastOptions, useBreakPoints } from "@/utils";

const workSans = Work_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
});

const config = createConfig({
  chains: [bscTestnet, bsc],
  multiInjectedProviderDiscovery: false,
  transports: {
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
});

const evmNetworks = [
  {
    blockExplorerUrls: ['https://bscscan.com'],
    chainId: 56,
    chainName: 'Binance Smart Chain Mainnet',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/bnb.svg'],
    name: 'Binance Smart Chain Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    networkId: 56,

    rpcUrls: ['https://bsc-dataseed.binance.org'],
    vanityName: 'BSC Mainnet',
  },
  {
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    chainId: 97,
    chainName: 'Binance Smart Chain Testnet',
    iconUrls: ['https://app.dynamic.xyz/assets/networks/bnb.svg'],
    name: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'BNB',
      symbol: 'BNB',
    },
    networkId: 97,
    rpcUrls: ['https://bsc-testnet.publicnode.com'],

    vanityName: 'BSC Testnet',
  },
];
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sm } = useBreakPoints();
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
    <html lang="en">
      <body id="__next" className={workSans.className}>
        <DynamicContextProvider
          settings={{
            initialAuthenticationMode: "connect-only",
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ID || "",
            walletConnectors: [
              EthereumWalletConnectors,
              SolanaWalletConnectors,
            ],
            overrides: {
              evmNetworks,
              views: [
                {
                  type: "wallet-list",
                  tabs: {
                    items: [
                      {
                        label: { text: "All chains" },
                      },
                      {
                        label: { icon: <EthereumIcon /> },
                        walletsFilter: FilterChain("EVM"),
                        recommendedWallets: [
                          {
                            walletKey: "phantomevm",
                          },
                        ],
                      },
                      {
                        label: { icon: <SolanaIcon /> },
                        walletsFilter: FilterChain("SOL"),
                      },
                    ],
                  },
                },
              ],
            },
            events: {
              onAuthInit: (args) => {
                console.log("onAuthInit was called", args);
                localStorage.setItem("dynamicLoginType", args?.type);
              },
              onEmbeddedWalletCreated: (jwtVerifiedCredential) => {
                console.log("onEmbeddedWalletCreated", jwtVerifiedCredential);
                console.log(
                  "onEmbeddedWalletCreated authToken",
                  getAuthToken()
                );
              },
              onAuthSuccess: (args) => {
                console.log("onAuthSuccess was called ", args);
                localStorage.setItem("dynamicAuthToken", getAuthToken() as string);
                localStorage.setItem("dynamicEmail", args?.user?.email || "");
                localStorage.setItem("dynamicAddress", args?.user?.verifiedCredentials[1]?.address || "");
              },
              onWalletAdded: (args) => {
                console.log("onWalletAdded was called ", args);
              },
              onSignedMessage: ({ messageToSign, signedMessage }) => {
                console.log(
                  `onSignedMessage was called: ${messageToSign}, ${signedMessage}`
                );
              },
            },
          }}
        >
          <WagmiProvider config={config}>
            <ReactQueryClientProvider>
              <DynamicWagmiConnector>
                <ThemeProvider theme={themes}>
                  <Toaster
                    position={sm ? "bottom-right" : "top-right"}
                    toastOptions={ToastOptions}
                  />
                  <StoreProvider>
                    <StyledEngineProvider injectFirst>
                      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                        <CssBaseline />
                        <AppHeader
                          LinkItems={LinkItems}
                          pathName={pathName}
                          useDarkTheme={useDarkTheme}
                          onChange={(target, value) => changeThemeHandler(target, value)}
                        />
                        {/* <Header /> */}
                        <main className=" text-white max-h-screen">{children}</main>
                      </AppRouterCacheProvider>
                    </StyledEngineProvider>
                  </StoreProvider>
                </ThemeProvider>
              </DynamicWagmiConnector>
            </ReactQueryClientProvider>
          </WagmiProvider>
        </DynamicContextProvider>
      </body>
    </html>
  );
}
