/* eslint-disable @typescript-eslint/no-explicit-any */
import INJECTED_DARK_ICON from '@/app/assets/images/wallets/browser-wallet-dark.svg'
import LEDGER_ICON from '@/app/assets/images/wallets/ledger-icon.svg'
import RABBY_ICON from '@/app/assets/images/wallets/rabby-icon.svg'
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import Assets from './assets'
import { InjectedConnector } from "@web3-react/injected-connector";
import { IEthereum } from '@dynamic-labs/ethereum';

declare global {
  interface Window {
    ethereum?: any
  }
}

const { METAMASK, BRAVE, TRUST_WALLET } = Assets

const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
  appName: "DexPay",
  /*  supportedChainIds: [1, 5, 137], */
});

const WalletConnect = new WalletConnectConnector({
  rpc: {
    5: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Injected = new InjectedConnector({
  /* supportedChainIds: [1, 5, 137] */
});

export const connectors: any = {
  injected: Injected,
  walletConnect: WalletConnect,
  coinbaseWallet: CoinbaseWallet,
};

const InjectedWalletTable = {
  isBraveWallet: { name: 'Brave', icon: BRAVE },
  isRabby: { name: 'Rabby', icon: RABBY_ICON },
  isTrust: { name: 'Trust Wallet', icon: TRUST_WALLET },
  isLedgerConnect: { name: 'Ledger', icon: LEDGER_ICON },
}

export function getInjection() {
  for (const [key, wallet] of Object.entries(InjectedWalletTable)) {
    if (window.ethereum?.[key as keyof Window['ethereum']]) return wallet
  }

  // Check for MetaMask last, as other injectors will also set this flag, i.e. Brave browser and Phantom wallet
  if (window.ethereum?.isMetaMask) return { name: 'MetaMask', icon: METAMASK }

  // Prompt metamask installation when there is no injection present or the only injection detected is coinbase (CB has separate entry point in UI)
  if (!window.ethereum || window.ethereum.isCoinbaseWallet) return { name: 'Install MetaMask', icon: METAMASK }

  // Use a generic icon when injection is present but no known non-coinbase wallet is detected
  return { name: 'Browser Wallet', icon: INJECTED_DARK_ICON }
}
