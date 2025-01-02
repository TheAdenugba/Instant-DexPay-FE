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
import { StyledEngineProvider } from "@mui/material/styles";
import { ChangeEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ReactQueryClientProvider } from "@/utils/RectQueryClient";
import AppHeader from "@/components/AppHeader";
import { EthereumIcon, SolanaIcon } from "@dynamic-labs/iconic";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "react-hot-toast";
import { ToastOptions, useBreakPoints } from "@/utils";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/store/store";
import ExternalLink from "./assets/icons/externalLink";
import Link from "next/link";
import Hydrator from "@/utils/Hydrator";

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

export const evmNetworks = [
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
  const router = useRouter();

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
      href: "/instant-buy",
      tabName: "Quick Trade",
    },
    {
      href: "/",
      tabName: "Send Money",
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
              onLogout: (args) => {
                console.log('onLogout was called', args);
                localStorage.removeItem("provider");
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("defaultAsset");
                localStorage.removeItem("dynamicLoginType");
              }
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
                    <Hydrator />
                    <PersistGate loading={null} persistor={persistor}>
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
                          <nav className="bg-[#101828] mb-10 p-2  w-full block lg:hidden">
                            <div className="list-none flex justify-between cursor-pointer text-sm sm:text-base">
                              <div className="flex space-x-2">
                                {LinkItems.map((el) => {
                                  return (
                                    <li
                                      onClick={() => router.push(el.href)}
                                      key={el.tabName}
                                      className={`p-2 border-0 ${pathName === el.href
                                        ? "border-b-4 border-solid border-b-[#F92556]"
                                        : "list-none"
                                        }`}
                                    >
                                      {el.tabName}
                                    </li>
                                  );
                                })}
                              </div>

                              <Link href="https://app.dexpay.io/">
                                <li
                                  className={`p-2 text-white border-0 gap-x-2 flex items-center ${pathName === "https://app.dexpay.io/"
                                    ? "border-b-4 border-solid border-b-[#F92556]"
                                    : "list-none"
                                    }`}
                                >
                                  P2P
                                  <ExternalLink />
                                </li>
                              </Link>
                            </div>
                          </nav>
                          <main className=" text-white max-h-screen mx-0 md:mx-1">{children}</main>
                        </AppRouterCacheProvider>
                      </StyledEngineProvider>
                    </PersistGate>
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
