/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Assets from './assets';
import { ethers } from "ethers";



export const paymentMethods = [
    {
        value: "Bank transfer",
        label: "Bank transfer",
    },
];

const { NAIRA_ICON, USDT_ICON, DUSD_ICON, USDC_ICON, FDC_ICON } = Assets;

export const useBreakPoints = () => {
    const theme = useTheme();
    const xxs = useMediaQuery(theme.breakpoints.up(350));
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    const xl = useMediaQuery(theme.breakpoints.up('xl'));
    return { xxs, xs, sm, md, lg, xl };
};

export const getCurrencyImage = (currency: string) => {
    switch (currency) {
        case "NGN":
            return NAIRA_ICON;
        case "FDC":
            return FDC_ICON;
        case "USDT":
            return USDT_ICON;
        case "USDC":
            return USDC_ICON;
        case "DUSD":
            return DUSD_ICON;
        case "mUSD":
            return DUSD_ICON;
        default:
            return USDT_ICON;
    }
};

export const ToastOptions = {
    duration: 6000,
    style: {
        fontFamily: "Work Sans",
    },
};

export const setAuthToken = (token: unknown) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

export const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function toFixedCustom(numb: any, fixed: unknown) {
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return numb.toString().match(re)[0];
}

export const convertToCurrency = (str: unknown, decimal = 2) => {

    if (str == undefined || null) {
        return ""
    }

    const convertedStr = toFixedCustom(Number(str), 2)

    let num;
    if (decimal === 0) {
        num = Number(convertedStr).toFixed(decimal);
        return `${num}.`.replace(/\d(?=(\d{3})+\.)/g, "$&,").replace(/\./, "");
    }
    if (decimal > 0) {
        return Number(convertedStr)
            .toFixed(decimal)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    }
    return convertedStr;
};

export const getMaxFiatOrderAmount = () => {
    return 5000000;
};

export const getMaxCryptoAdAmount = (verified: any) => {
    if (verified) {
        return 50001;
    } else {
        return 10001;
    }
};
export const getMaxCryptoOrderAmount = (verified: any) => {
    if (verified) {
        return 10001;
    } else {
        return 5001;
    }
};
export const getMinimumAdLimit = () => {
    return 5;
};

export const getMinimumOrderLimit = () => {
    return 5;
};

type IEntryCalculatorTabChange = {
    tradeAmount: string;
    orderType: string;
    price: number | string;
    orderFee: number | string
}
type IExpressEntryCalculator = {
    inputfield: string
    tradeAmount: string;
    receiveAmount: string;
    orderType: string;
    price: number | string;
    orderFee: number | string
}
export const expressEntryCalculatorTabChange = ({
    // inputfield: string,
    tradeAmount,
    // receiveAmount,
    orderType,
    price,
    orderFee
}: IEntryCalculatorTabChange
) => {
    let amountToReceive;
    let amountToTrade;
    if (+tradeAmount < getMinimumAdLimit() && orderType == "sell") {
        amountToReceive = "0";
    } else if (
        +tradeAmount < getMinimumAdLimit() * Number(price) &&
        orderType == "buy"
    ) {
        amountToReceive = "0";
    } else {
        if (orderType == "sell") {
            amountToReceive = String(
                ((Number(tradeAmount) - Number(orderFee)) * Number(price)).toFixed(2)
            );
        } else {
            amountToReceive = String(
                (Number(tradeAmount) / Number(price) - Number(orderFee)).toFixed(2)
            );
        }
    }

    return {
        amountToTrade: amountToTrade,
        amountToReceive: amountToReceive,
    };
};

export const expressEntryCalculator = async (
    {
        inputfield,
        tradeAmount,
        receiveAmount,
        orderType,
        price,
        orderFee
    }: IExpressEntryCalculator) => {
    let amountToReceive;
    let amountToTrade;
    // InputField is tradeAmount
    if (inputfield == "tradeAmount") {
        if (+tradeAmount < getMinimumAdLimit() && orderType == "sell") {
            amountToReceive = "0";
        } else if (
            +tradeAmount < getMinimumAdLimit() * Number(price) &&
            orderType == "buy"
        ) {
            amountToReceive = "0";
        } else {
            if (orderType == "sell") {
                amountToReceive = String(
                    ((Number(tradeAmount) - Number(orderFee)) * Number(price)).toFixed(2)
                );
            } else {
                amountToReceive = String(
                    (Number(tradeAmount) / Number(price) - Number(orderFee)).toFixed(2)
                );
            }
        }
    }
    // If inputfield is receiveAmount
    else if (inputfield == "receiveAmount") {
        if (+receiveAmount < getMinimumAdLimit() && orderType == "buy") {
            amountToTrade = "0";
        } else if (
            +receiveAmount < getMinimumAdLimit() * Number(price) &&
            orderType == "sell"
        ) {
            amountToTrade = "0";
        } else {
            if (orderType == "sell") {
                amountToTrade = String(
                    (Number(receiveAmount) / Number(price) + Number(orderFee)).toFixed(2)
                );
            } else {
                amountToTrade = String(
                    ((Number(receiveAmount) + Number(orderFee)) * Number(price)).toFixed(
                        2
                    )
                );
            }
        }
    }

    return {
        amountToTrade: amountToTrade,
        amountToReceive: amountToReceive,
    };
};

export const fetchTokenAddress = (assets: any, asset: any) => {
    if (asset && assets && Array.isArray(assets)) {
        const tokenAddress: any = assets.filter((it) => it.symbol == asset);
        return tokenAddress[0].tokenAddress || tokenAddress.tokenAddress;
    } else {
        return "";
    }
};


export const getCurrencySymbol = (currency: string) => {
    switch (currency) {
        case "NGN":
            return "₦";
        case "FDC":
            return "D";
        case "GBP":
            return "£";
        case "USD":
            return "$";
        case "DUSD":
            return "$";
        case "USDT":
            return "$";
        case "EUR":
            return "€";
        default:
            return "$";
    }
};

export const getCurrencyName = (currency: string) => {
    switch (currency) {
        case "NGN":
            return "Naira";
        case "FDC":
            return "FiatD";
        case "GBP":
            return "Pounds";
        case "USD":
            return "Dollars";
        case "EUR":
            return "Euro";
        default:
            return "FiatD";
    }
};

export const getCurrencyCode = (countryCode: string) => {
    switch (countryCode) {
        case "NG":
            return "NGN";
        case "UK":
            return "GBP";
        case "US":
            return "USDT";
        default:
            return "NGN";
    }
};
export const shortenedAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

export const getAddressToDisplay = (
    ownerAddress: any,
    sellerAddress: any,
    buyerAddress: any
) => {
    if (ownerAddress == sellerAddress) {
        return buyerAddress;
    } else {
        return sellerAddress;
    }
};

export const getUsernameToDisplay = (
    ownerUsername: any,
    sellerUsername: any,
    buyerUsername: any
) => {
    if (ownerUsername == sellerUsername) {
        return buyerUsername;
    } else {
        return sellerUsername;
    }
};

export const getShowVerifiedCheck = (
    ownerUsername: any,
    sellerUsername: any,
    sellerVerifiedCheck: any,
    buyerVerifiedCheck: any
) => {
    if (ownerUsername == sellerUsername) {
        return buyerVerifiedCheck;
    } else {
        return sellerVerifiedCheck;
    }
};

export const getNameToDisplay = (ownerName: any, sellerName: any, buyerName: any) => {
    if (ownerName == sellerName) {
        return buyerName;
    } else {
        return sellerName;
    }
};

export const getMinute = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    if (String(min).length == 1) {
        return "0" + min;
    } else {
        return min;
    }
};

// export const getSeconds = (seconds: number): string => {
//     const sec = seconds % 60; // Use modulo to get remaining seconds
//     return sec.toString().padStart(2, "0"); // Ensures 2 digits (e.g., "09")
// };
export const getSeconds = (seconds: number) => {
    const minute = Math.floor(seconds / 60);
    const sec = Math.round(seconds - minute * 60);
    if (String(sec).length == 1) {
        return "0" + sec;
    } else {
        return sec;
    }
};

export const convertToBigInt = (amount: string | number) => {
    if (amount === 0 || amount === "0") {
        return 0;
    } else {
        return ethers.parseEther(amount.toString())
    }
};
