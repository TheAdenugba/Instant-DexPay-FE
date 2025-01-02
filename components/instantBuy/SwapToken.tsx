/* eslint-disable @typescript-eslint/no-explicit-any */
"use Client";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import Sync from "@/app/assets/icons/sync";
import Grid from "@mui/material/Grid2";
import { Button, CircularProgress, Container, FormControl, MenuItem } from "@mui/material";
import SwapIcon from "@/app/assets/icons/swap";
import AppText from "../AppText";
import {
    DynamicConnectButton,
    useDynamicContext,
    useIsLoggedIn,
    useSwitchWallet,
    useUserWallets,
    useWalletConnectorEvent,
} from "@dynamic-labs/sdk-react-core";
import {
    useAuthenticateAddress,
    useGetAddress,
    useGetNonce,
    useGetProfile,
    useHandleSocialLogin,
    useRequestOtp,
} from "@/services/mutations/logins";
import { useAccount, useChainId, useDisconnect, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    resetUserState,
    updateEmailAddress,
    updateIsAuth,
    updateNonce,
    updateUser,
    updateWalletAddress,
    updateWalletStatus,
} from "@/store/slices/userSlice";
import {
    convertToCurrency,
    expressEntryCalculator,
    expressEntryCalculatorTabChange,
    fetchTokenAddress,
    getCurrencyImage,
    getMaxCryptoOrderAmount,
    getMaxFiatOrderAmount,
    getMinimumAdLimit,
    setAuthToken,
    shortenedAddress,
} from "@/utils";
import toast from "react-hot-toast";
import {
    resetAddressState,
    updateAddressData,
    updateSignature,
} from "@/store/slices/addressSlice";
import ConnectWallet from "../GeneralModals/ConnectWallet";
import VerifySignatureDialog from "../GeneralModals/VerifySignatureDialog";
import EmailUi from "../GeneralModals/EmailUi";
import EmailVerify from "../GeneralModals/EmailVerify";
import SwitchNetwork from "../GeneralModals/SwitchNetwork";
import { persistor, RootState } from "@/store/store";
import SwapTokenInput from "../SwapTokenInput";
import {
    useFetchAssets,
    useFetchCurrencies,
    useGetAmountToReceive,
    useGetRefreshRate,
    useHandleBestRate,
} from "@/services/mutations/swap.mutations";
import { useDebounce } from "use-debounce";
import useFee from "@/hooks/useFee";
import { config } from "@/utils/config";
import { getBalance } from "wagmi/actions";
import TextSelect from "../SwapSelect";
import {
    resetTradeState,
    updateExpressOrderData,
    updateTradeData,
} from "@/store/slices/traderSlice";
import { LabelStyle } from "../GeneralModals/ModalStyles";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import SelectComponent, { SelectProps } from "../Select";
import { SingleValue } from "react-select";
import WalletIcon from "@/app/assets/icons/wallet";
import { evmNetworks } from "@/app/layout";
import AppTextInput from "../AppTextInput";

type Props = {
    handleClick: () => void;
};
const SwapToken = ({ handleClick }: Props) => {
    const switchWallet = useSwitchWallet();
    const { signMessageAsync } = useSignMessage();
    const isLoggedIn = useIsLoggedIn();
    const { isAuthenticated, user, nonce } = useAppSelector(
        (state: RootState) => state.userReducer
    );
    const { paymentAccount, expressOrderData, tradeData } = useAppSelector(
        (state) => state.tradeReducer
    );
    const { defaultCurrency } = useAppSelector((state) => state.countryReducer);
    const { data: currencies } = useFetchCurrencies();
    const { data: assets } = useFetchAssets();
    const { data: profile } = useGetProfile();
    const dispatch = useAppDispatch();
    const userWallets = useUserWallets();
    const { primaryWallet, handleLogOut, authToken, user: dynamicUser } = useDynamicContext();
    const [amountCurrencies, setAmountCurrencies] = useState<any>();
    const [amountToReceiveCurrencies, setAmountToReceiveCurrencies] = useState<any>();
    const [currentStep, setCurrentStep] = useState("");
    const [selectedValue] = useState("");
    const [openConnectModal, setOpenConnectModal] = useState(false);
    const [emailVerified, setEmailVerified] = useState(true);
    const [maxBalance, setMaxBalance] = useState(0);
    const [price, setPrice] = useState("");
    const [tradeOrderId, setTradeOrderId] = useState("");
    const [receiveAmount, setReceiveAmount] = useState("0");
    const [tradeAmount, setTradeAmount] = useState("0");
    const [field, setField] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [obj, setObj] = useState({} as any);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');


    const [walletInfo, setWalletInfo] = useState<any[]>([]);
    const classes = LabelStyle();
    const { fee } = useFee(user.verifiedCheck);
    const [realTradeAmount] = useDebounce(tradeAmount, 1000);
    const [realReceiveAmount] = useDebounce(receiveAmount, 1000);
    const chainId = useChainId();
    const { address } = useAccount();

    const { disconnect } = useDisconnect();
    const { mutateAsync: handleAuthenticate, isPending } = useAuthenticateAddress();
    const { mutateAsync: handleOTP } = useRequestOtp();
    const { mutateAsync: socialLogin } = useHandleSocialLogin();
    const {
        data: nonceData,
        error: nonceError,
        isError: isNonceError,
    } = useGetNonce(primaryWallet?.address);
    const { data: addressData, isError: isGetAddressError } = useGetAddress(
        primaryWallet?.address
    );
    const { mutateAsync: handleBestRate, isPending: bestRatePending } = useHandleBestRate();

    const [formData, setFormData] = useState({
        orderType: expressOrderData?.orderType || "buy",
        amount: expressOrderData?.amount || "",
        amountToReceive: "",
        fiat: expressOrderData?.fiat || defaultCurrency,
        asset:
            expressOrderData?.asset !== ""
                ? expressOrderData?.asset
                : assets?.[0]?.name ||
                (typeof window !== "undefined" && localStorage.getItem("defaultAsset")),
    });

    const { orderType, fiat, asset } = formData;
    const { mutateAsync: getAmountToReceive, isPending: amountToReceivePending } =
        useGetAmountToReceive();

    const handleDisconnect = () => {
        window.localStorage.removeItem("provider");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("defaultAsset");
        persistor.purge();
        dispatch(resetUserState());
        dispatch(resetAddressState());
        dispatch(resetTradeState());
        dispatch(updateIsAuth(false));
        // handleCloseDialog();
        // handleClose();
        handleLogOut();
        disconnect();
        toast.success("Wallet Disconnected", {
            id: "disconnected",
        });
    };

    const handleCloseConnectModal = () => {
        setOpenConnectModal(false);
    };

    const handleSwitchNetworkModal = () => {
        // handleClose();
        setOpenConnectModal(false);
    };
    const publicAddresses = userWallets.map((el) => ({
        address: el.address,
        chain: el.chain,
    }));

    useWalletConnectorEvent(
        primaryWallet?.connector,
        "accountChange",
        ({ accounts }, connector) => {
            handleDisconnect();
            console.group("accountChange");
            console.log("accounts", accounts);
            console.log("connector that emitted", connector);
            console.groupEnd();
        }
    );
    useWalletConnectorEvent(primaryWallet?.connector, "disconnect", () => {
        handleDisconnect();
    });
    const handleSocialSignUp = async () => {
        try {
            // const dynamicEmail = localStorage.getItem("dynamicEmail") || "";
            // const dynamicAddress = localStorage.getItem("dynamicAddress") || "";
            // const dynamicAuthToken = localStorage.getItem("dynamicAuthToken") || "";
            // if (!primaryWallet) return;

            // const message = new SiweMessage({
            //     domain: "app.dexpay.io",
            //     address: primaryWallet?.address,
            //     uri: origin,
            //     nonce: generateNonce(),
            //     version: "1",
            //     chainId: chainId,
            // });
            // const signatureMessage = message.prepareMessage();
            // await primaryWallet.signMessage(signatureMessage);

            const pubAddresses: { address: string; chain: string }[] = [];

            userWallets.forEach((wallet) => {
                pubAddresses.push({
                    address: wallet.address,
                    chain: wallet.chain == "EVM" ? "BSC" : wallet.chain,
                });
            });
            userWallets.forEach((wallet) => {
                pubAddresses.push({
                    address: wallet.address,
                    chain: wallet.chain,
                });
            });

            const req = await socialLogin({
                publicAddresses: publicAddresses,
                emailAddress: dynamicUser?.email,
                referredBy: "socialLogin",
                dlToken: authToken,
            });
            const res = req?.data;

            dispatch(updateEmailAddress(dynamicUser?.email || ""));
            dispatch(updateWalletAddress(primaryWallet?.address || ""));

            if (res) {
                JSON.stringify(localStorage.setItem("token", res?.auth?.accessToken));
                JSON.stringify(localStorage.setItem("refreshToken", res?.auth?.refreshToken));
                dispatch(updateIsAuth(true));
                dispatch(updateWalletStatus("ACTIVE"));
                dispatch(
                    updateUser({
                        _id: res?._id,
                        username: res?.username,
                        type: res?.type,
                        status: res?.status,
                        emailAddress: res?.emailAddress,
                        createdAt: res?.createdAt,
                        updatedAt: res?.updatedAt,
                        verifiedCheck: res?.verifiedCheck,
                        phoneVerified: res?.phoneVerified,
                    })
                );
                setAuthToken(res?.auth?.accessToken);
                toast.dismiss();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, {
                duration: 9999999999,
            });
        }
    };

    useEffect(() => {
        if (
            primaryWallet?.address &&
            !isAuthenticated &&
            !window.localStorage.getItem("token")
        ) {
            if (!openConnectModal) {
                toast.loading("Connecting...", {
                    id: "connecting",
                    duration: 9999999999999,
                });
            }
            dispatch(updateAddressData(addressData?.data));
            setEmailVerified(addressData?.data?.emailVerified);
            if (
                (addressData?.data?.emailVerified && addressData?.data?.status == "ACTIVE") ||
                (!addressData?.data?.emailVerified && addressData?.data.status == "PENDING")
            ) {
                if (nonceData?.data?.nonce) {
                    toast.dismiss();
                    setCurrentStep("9");
                    setOpenConnectModal(true);
                    dispatch(updateNonce(nonceData?.data?.nonce));
                }
            }
        }
    }, [primaryWallet?.address, addressData?.data, nonceData]);

    useEffect(() => {
        if (isNonceError === true) {
            toast.dismiss();
            toast.error(nonceError?.message, {
                id: "error",
            });
        }
    }, [isNonceError]);

    const { mutateAsync: refresh, isPending: refreshLoading } = useGetRefreshRate();

    const calculate = (price: string) => {
        const res = expressEntryCalculatorTabChange({
            // field,
            tradeAmount,
            // receiveAmount,
            orderType,
            price,
            orderFee: fee.orderFee,
        });

        if (res?.amountToTrade) {
            setTradeAmount(res?.amountToTrade);
        } else if (res?.amountToReceive) {
            setReceiveAmount(res?.amountToReceive);
        }
    };

    // Function to get current rate
    const refreshRate = async () => {
        try {
            const response = await refresh({ asset, orderType });
            setPrice(response.data.price);
            // Call Express Entry calculator
            calculate(response.data.price);
        } catch (error: any) {
            if (error?.response?.data?.message)
                toast.error(error.response.data.message, {
                    id: "error",
                });
        }
    };

    // Function to get best rate with amount
    const fetchBestRateforAmount = async () => {
        try {
            let body;
            if (orderType == "buy" && field == "tradeAmount") {
                body = {
                    fiat: Number(realTradeAmount),
                    type: orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            } else if (orderType == "buy" && field == "receiveAmount") {
                body = {
                    quantity: Number(realReceiveAmount),
                    type: orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            } else if (orderType == "sell" && field == "tradeAmount") {
                body = {
                    quantity: Number(realTradeAmount),
                    type: orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            } else if (orderType == "sell" && field == "receiveAmount") {
                body = {
                    fiat: Number(realReceiveAmount),
                    type: orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            }
            const response = await handleBestRate({ asset: asset, data: body });
            if (!response?.data?.price) {
                toast.error("No ads match");
                return;
            }
            setPrice(response?.data?.price);
            setTradeOrderId(response?.data?._id);
            // Call Express Entry calculator
            const calculate = async () => {
                const res = await expressEntryCalculator({
                    inputfield: field,
                    tradeAmount: realTradeAmount,
                    receiveAmount: realReceiveAmount,
                    orderType,
                    price: response.data.price,
                    orderFee: fee.orderFee,
                });

                if (res?.amountToTrade) {
                    setTradeAmount(res?.amountToTrade);
                    return;
                } else if (res?.amountToReceive) {
                    setReceiveAmount(res?.amountToReceive);
                    return;
                }
            };

            calculate();
        } catch (error: any) {
            if (error?.response?.data?.message)
                toast.error(error.response.data.message, {
                    id: "error",
                });
        }
    };
    const receiveAmountFn = async () => {
        try {
            const response = await getAmountToReceive({ asset, orderType });
            setPrice(response.data.price);
        } catch (error: any) {
            if (error?.response?.data?.message)
                toast.error(error.response.data.message, {
                    id: "error",
                });
        }
    };

    const fetchAddresses = async () => {
        // Wait for all promises to resolve
        const results = await Promise.all(
            userWallets.map(async (wallet) => {
                const balance = await wallet.getBalance(); // Await balance
                const network = await wallet.getNetwork();
                // setSelectedAddress(wallet.address);
                return {
                    id: wallet.id,
                    address: wallet.address, // Assuming `wallet` has an `address` property
                    balance,
                    currency: evmNetworks.find((el) => el.chainId === network)?.nativeCurrency
                        ?.symbol,
                };
            })
        );
        const res = results.map((el) => ({
            id: el.id,
            label: `${shortenedAddress(el.address)}`,
            value: el.address,
            svgIcon: <WalletIcon />,
            amount: `${el.balance} ${el.currency || "SOL"}`,
        }));
        setWalletInfo([...res,
        {
            label: `External Wallet`,
            value: 'external',
            svgIcon: <WalletIcon />,
            amount: ``,

        }]); // Returns an array of objects with address and balance
        if (res.length > 0) {
            setObj(res[0]);
        }
    };

    // ALL USEEFFECTS //
    useEffect(() => {
        fetchAddresses();
    }, [userWallets]);

    useEffect(() => {
        setFormData({
            orderType: expressOrderData?.orderType || "buy",
            amount: expressOrderData?.amount || "",
            amountToReceive: "",
            fiat: expressOrderData?.fiat || defaultCurrency,
            asset:
                expressOrderData?.asset !== ""
                    ? expressOrderData?.asset
                    : (typeof window !== "undefined" && localStorage.getItem("defaultAsset")) ||
                    assets?.[0]?.name,
        });
    }, [assets, expressOrderData]);

    useEffect(() => {
        receiveAmountFn();
    }, [asset]);

    useEffect(() => {
        if (profile?.data?.user) {
            dispatch(updateUser(profile?.data?.user));
            dispatch(updateIsAuth(true));
        } else {
            dispatch(updateIsAuth(false));
        }
    }, [profile?.data?.user]);

    useEffect(() => {
        if (!!isGetAddressError) {
            if (localStorage.getItem("dynamicLoginType") !== "wallet") {
                handleSocialSignUp();
            } else {
                toast.dismiss();
                setCurrentStep("2");
                setOpenConnectModal(true);
            }
        }
    }, [isGetAddressError]);

    useEffect(() => {
        const getTokenBalance = async () => {
            const balance = await getBalance(config, {
                address: address as `0x${string}`,
                token: fetchTokenAddress(assets, asset) as `0x${string}`,
            });
            // console.log("See this bal>>>>>>> + " + balance.value)
            setMaxBalance(Number(balance.value) / 1000000000000000000);
        };
        if (address) getTokenBalance();
    }, [address, asset]);

    useEffect(() => {
        if (orderType == "buy") {
            setAmountCurrencies(currencies);
            setAmountToReceiveCurrencies(assets);
        } else {
            setAmountCurrencies(assets);
            setAmountToReceiveCurrencies(currencies);
        }
    }, [orderType, currencies, assets]);

    useEffect(() => {
        if (field == "tradeAmount") {
            if (Number(realTradeAmount) > 1) {
                fetchBestRateforAmount();
            } else {
                setReceiveAmount("");
            }
        }
    }, [realTradeAmount]);

    useEffect(() => {
        if (field == "receiveAmount") {
            if (Number(realReceiveAmount) > 1) {
                fetchBestRateforAmount();
            } else {
                setTradeAmount("");
            }
        }
    }, [realReceiveAmount]);

    /* END useEffect */

    const handleChangeTab = (value: string) => {
        if (value == "buy") {
            setTradeAmount("");
            setReceiveAmount("");
            setFormData({
                ...formData,
                orderType: value,
                fiat: defaultCurrency,
                asset:
                    expressOrderData?.asset !== ""
                        ? expressOrderData?.asset
                        : localStorage.getItem("defaultAsset") || assets[0].name,
            });
            setAmountCurrencies(currencies);
            setAmountToReceiveCurrencies(assets);
        } else {
            setTradeAmount("");
            setReceiveAmount("");
            setFormData({
                ...formData,
                orderType: value,
                asset:
                    expressOrderData?.asset !== ""
                        ? expressOrderData?.asset
                        : localStorage.getItem("defaultAsset") || assets[0].name,
                fiat: defaultCurrency,
            });
            setAmountCurrencies(assets);
            setAmountToReceiveCurrencies(currencies);
        }
    };

    const onChangeFiat = (e: { target: { value: any } }) => {
        setFormData({
            ...formData,
            fiat: e.target.value,
        });
    };

    const onChangeAsset = (e: { target: { value: any } }) => {
        setFormData({
            ...formData,
            asset: e.target.value,
        });
    };
    const handleNext = () => {
        if (!Number(tradeAmount)) {
            toast.error("Oops, Amount Input field is empty", {
                id: "error",
            });
            return;
        }

        if (orderType == "sell" && Number(tradeAmount) > Number(maxBalance)) {
            toast.error("Insufficient Wallet Balance", {
                id: "error",
            });
            return;
        }

        if (!selectedAddress) {
            toast.error("Oops, Select an address", {
                id: "error",
            });
            return;
        }
        dispatch(
            updateTradeData({
                ...tradeData,
                _id: tradeOrderId,
            })
        );
        dispatch(
            updateExpressOrderData({
                ...expressOrderData,
                orderType: orderType,
                price: Number(price),
                fiat: fiat,
                asset: asset,
                amount: tradeAmount,
                amountToReceive: receiveAmount,
                paymentAccountId: paymentAccount._id,
                inputField: field,
                serviceFee: fee.orderFee,
                walletAddress: selectedAddress,
            })
        );

        // if ordertype is buy set next step to 2
        if (orderType == "buy") {
            handleClick();
        }
        // if ordertype is sell
        else {
            handleClick();
            // if no default payment account is found redirect to add payment page
            // if (!paymentAccount._id) {
            //     setCurrentStep("3");
            // } else {
            //     handleClick()
            // }
        }
    };
    const authenticateAddress = async (signature: string, signatureMessage: string) => {
        try {
            const response = await handleAuthenticate({
                publicAddress: primaryWallet?.address,
                signature: signature,
                message: signatureMessage,
            });
            const res = response.data;

            if (res.auth) {
                localStorage.setItem("token", res.auth.accessToken);
                localStorage.setItem("refreshToken", res.auth.refreshToken);
                dispatch(updateIsAuth(true));
                dispatch(updateWalletStatus(res.status));
                dispatch(updateUser(res.user));
                setAuthToken(res.auth.accessToken);
                handleCloseConnectModal();
                toast.success("Authentication Successful");
            }
        } catch (error: any) {
            dispatch(updateIsAuth(false));
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });
            //setCurrentStep("6");
        }
    };

    const OTPHandler = async (address: unknown) => {
        try {
            // if emailVerified is false, call request otp and redirect to otp modal
            await handleOTP(address);
            setCurrentStep("3");
        } catch (error: any) {
            toast.error(error.message, {
                id: "error",
            });
        }
    };
    const handleVerifySignature = async () => {
        try {
            setOpenConnectModal(false);
            if (emailVerified) {
                if (!primaryWallet) return;
                if (isSolanaWallet(primaryWallet)) {
                    //const nonce = generateNonce();
                    const signature = await primaryWallet.signMessage(nonce);
                    if (signature) {
                        dispatch(updateSignature({ signature, signatureMessage: nonce }));
                        authenticateAddress(signature, nonce);
                    }
                }

                // else if it's EVM wallet generate evm signature
                if (isEthereumWallet(primaryWallet)) {
                    const message = new SiweMessage({
                        domain: "app.dexpay.io",
                        address: primaryWallet?.address,
                        uri: origin,
                        nonce: nonce,
                        version: "1",
                        chainId: chainId,
                    });
                    const signature = await signMessageAsync({
                        message: message.prepareMessage(),
                    });
                    dispatch(
                        updateSignature({
                            signature,
                            signatureMessage: message.prepareMessage(),
                        })
                    );
                    authenticateAddress(signature, message.prepareMessage());
                }
            } else {
                // if emailVerified is false, call request otp and redirect to otp modal
                OTPHandler(primaryWallet?.address);
            }
        } catch (error: any) {
            toast.error(error.message, {
                id: "error",
            });
        }
    };
    const stepComponent = (currentStep: any) => {
        let currenStepComponent = null;

        switch (currentStep) {
            case "1":
                currenStepComponent = (
                    <ConnectWallet
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        open={openConnectModal}
                        onClose={handleCloseConnectModal}
                        selectedValue={selectedValue}
                    />
                );
                break;
            case "2":
                currenStepComponent = (
                    <EmailUi
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        open={openConnectModal}
                        onClose={handleCloseConnectModal}
                        selectedValue={selectedValue}
                    />
                );
                break;
            case "3":
                currenStepComponent = (
                    <EmailVerify
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        open={openConnectModal}
                        onClose={handleCloseConnectModal}
                        selectedValue={selectedValue}
                    />
                );
                break;
            case "7":
                currenStepComponent = (
                    <SwitchNetwork
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        onClickSwitch={handleSwitchNetworkModal}
                        open={openConnectModal}
                        onClose={handleDisconnect}
                        selectedValue={selectedValue}
                    />
                );
                break;
            case "9":
                currenStepComponent = (
                    <VerifySignatureDialog
                        isPending={isPending}
                        emailVerified={emailVerified}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        open={openConnectModal}
                        onClose={handleCloseConnectModal}
                        selectedValue={selectedValue}
                        handleVerifySignature={handleVerifySignature}
                    />
                );
                break;
            default:
                currenStepComponent = (
                    <ConnectWallet
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        open={openConnectModal}
                        onClose={handleCloseConnectModal}
                        selectedValue={selectedValue}
                    />
                );
                break;
        }
        return currenStepComponent;
    };
    const handleSelect = (e: any) => {
        if (e.id) {
            switchWallet(e.id);
            setSelectedAddress(e.value);
            setObj(e);
            setShowInput(false);
        } if (e.value.includes('external')) {
            setShowInput(true);
        }
    };
    const handleValChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWalletAddress(event.target.value);
    };


    return (
        <div className="flex flex-col w-full items-start">
            <Container
                className="mt-10"
                sx={{
                    width: { xs: "100%", sm: "80%", lg: "30%", xl: "30%" },
                    py: 3,
                    backgroundColor: (theme) =>
                        theme.palette.mode === "dark" ? "#101828" : "#fff",
                    color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000"),
                    borderRadius: 2,
                }}
            >
                <div className="flex mb-4 bg-[#262f3d] p-2 rounded-xl space-x-2">
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className={`${orderType === "buy" ? "bg-gray-700" : "text-gray-400"}`}
                        onClick={() => {
                            handleChangeTab("buy");
                        }}
                    >
                        Buy
                    </Button>
                    <Button
                        variant="text"
                        color="inherit"
                        fullWidth
                        className={`${orderType === "sell" ? "bg-gray-700" : "text-gray-400"}`}
                        onClick={() => {
                            handleChangeTab("sell");
                        }}
                    >
                        Sell
                    </Button>
                </div>

                <div className="w-full my-8">
                    <label
                        htmlFor="amount"
                        className="text-sm font-medium text-white mb-1 flex justify-between items-center"
                    >
                        <div className="text-md">
                            Amount to {orderType === "buy" ? "buy" : "sell"}
                        </div>
                    </label>
                    <Grid container>
                        <Grid size={{ xs: 7, sm: 9 }}>
                            <SwapTokenInput
                                name="amount"
                                value={tradeAmount}
                                placeholder="0.00"
                                onFocus={() => {
                                    setField("tradeAmount");
                                }}
                                onChange={(value: any) => {
                                    setTradeAmount(value);
                                    setHasInteracted(true)
                                }}
                                maxLimit={true}
                                maxInputAmount={
                                    orderType == "buy"
                                        ? getMaxFiatOrderAmount()
                                        : getMaxCryptoOrderAmount(user?.verifiedCheck)
                                }
                                errorText={
                                    hasInteracted &&
                                        tradeAmount !== "0.00" &&
                                        orderType == "sell" &&
                                        Number(tradeAmount) < getMinimumAdLimit()
                                        ? `Minimum order amount is ${getMinimumAdLimit()}`
                                        : hasInteracted &&
                                            tradeAmount !== "0" &&
                                            orderType == "buy" &&
                                            Number(tradeAmount) < getMinimumAdLimit() * Number(price)
                                            ? `Minimum order amount is ${convertToCurrency(
                                                getMinimumAdLimit() * Number(price)
                                            )}`
                                            :
                                            hasInteracted &&
                                                orderType === "sell" && Number(tradeAmount) > Number(maxBalance)
                                                ? `Insufficient balance`
                                                : null
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 5, sm: 3 }}>
                            <FormControl fullWidth>
                                <TextSelect
                                    value={orderType === "buy" ? fiat : asset}
                                    onChange={orderType === "buy" ? onChangeFiat : onChangeAsset}
                                >
                                    {amountCurrencies?.map((option: any) => (
                                        <MenuItem
                                            key={option?.currencyCode || option?.name}
                                            value={option?.currencyCode || option?.name}
                                        >
                                            <div
                                                className="text-base"
                                                style={{ display: "flex", alignItems: "center" }}
                                            >
                                                <Image
                                                    src={getCurrencyImage(option?.currencyCode || option?.name)}
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                    style={{ marginRight: "10px" }}
                                                />{" "}
                                                {option?.currencyCode || option?.name}
                                            </div>
                                        </MenuItem>
                                    ))}
                                </TextSelect>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <div className="sm:flex-row sm:items-center justify-between mt-2 hidden md:flex">
                        <div className=" text-xs sm:text-sm text-white flex items-center ">
                            1.00 {asset} = {fiat} {convertToCurrency(price)}{" "}
                            <Sync onClick={() => refreshRate()} className="ml-2 mr-1 cursor-pointer" />
                            Est Fee = ${convertToCurrency(fee.orderFee)}
                        </div>
                        {orderType === "sell" ? (
                            <div className="flex text-xs sm:text-sm text-white">
                                <span className="hidden md:block">Network:</span> BEP20
                            </div>
                        ) : null}
                    </div>

                    <div className="flex justify-center my-4">
                        <SwapIcon className="size-4 " />
                    </div>

                    <div className={classes.labelDiv}>
                        <label
                            htmlFor="amount"
                            className="text-sm font-medium text-white mb-1 flex justify-between items-center"
                        >
                            <div className="text-md">Amount to receive</div>
                        </label>
                        <Grid container>
                            <Grid size={{ xs: 7, sm: 9 }}>
                                <SwapTokenInput
                                    disabled={true}
                                    name="amountToReceive"
                                    value={receiveAmount}
                                    placeholder="0.00"
                                    onFocus={() => {
                                        setField("receiveAmount");
                                    }}
                                    onChange={(value: any) => {
                                        setReceiveAmount(value);
                                    }}
                                    endAdorn={
                                        (refreshLoading || amountToReceivePending || bestRatePending) && (
                                            <CircularProgress sx={{ color: "white" }} size={20} />
                                        )
                                    }
                                />
                            </Grid>
                            <Grid size={{ xs: 5, sm: 3 }}>
                                <FormControl fullWidth>
                                    <TextSelect
                                        value={orderType === "buy" ? asset : fiat}
                                        onChange={orderType === "buy" ? onChangeAsset : onChangeFiat}
                                    >
                                        {amountToReceiveCurrencies?.map((option: any) => {
                                            return (
                                                <MenuItem
                                                    key={option?.name || option?.currencyCode}
                                                    value={option?.name || option?.currencyCode}
                                                >
                                                    <div
                                                        className="text-sm"
                                                        style={{ display: "flex", alignItems: "center" }}
                                                    >
                                                        <Image
                                                            src={getCurrencyImage(option?.name || option?.currencyCode)}
                                                            alt=""
                                                            width={20}
                                                            height={20}
                                                            style={{ marginRight: "10px" }}
                                                        />{" "}
                                                        {option?.name || option?.currencyCode}
                                                    </div>
                                                </MenuItem>
                                            );
                                        })}
                                    </TextSelect>
                                </FormControl>
                            </Grid>
                            {orderType === "buy" ? (
                                <div className="mt-2 text-xs sm:text-sm text-white flex justify-end w-full">
                                    Network: {profile?.data?.chain}
                                </div>
                            ) : null}
                        </Grid>
                    </div>
                </div>

                <div className="sm:flex-row sm:items-center justify-between mb-6 block md:hidden">
                    <div className=" text-xs sm:text-sm text-white flex items-center ">
                        1.00 {asset} = {fiat} {convertToCurrency(price)}{" "}
                        <Sync onClick={() => refreshRate()} className="ml-2 mr-1 cursor-pointer" />
                        Est Fee = ${convertToCurrency(fee.orderFee)}
                    </div>
                    {orderType === "sell" ? (
                        <div className="flex text-xs sm:text-sm text-white">
                            Network: {profile?.data?.chain}
                        </div>
                    ) : null}
                </div>
                <div className={classes.labelDivSecond}>
                    <label
                        htmlFor="amount"
                        className="text-sm font-medium text-white mb-1 flex justify-between items-center"
                    >
                        {orderType == "buy" ? (
                            <div className="text-md">Buy to</div>
                        ) : (
                            <div className="text-md">Sell from</div>
                        )}
                    </label>

                    <SelectComponent
                        options={walletInfo}
                        onChange={(el) => handleSelect(el as SingleValue<SelectProps>)}
                        value={obj}
                    />

                    {!!showInput &&
                        <FormControl className="mt-10" fullWidth>
                            <AppTextInput
                                onChange={handleValChange}
                                placeholder='Enter Wallet Address'
                                val={walletAddress} label='Wallet Address' />
                        </FormControl>
                    }
                </div>
                <div className="flex-col items-center space-y-3 mt-8 hidden md:flex">
                    {isAuthenticated && isLoggedIn ? (
                        <Button
                            size="large"
                            onClick={handleNext}
                            fullWidth
                            className="bg-white rounded-lg text-black capitalize mb-3"
                        >
                            Proceed
                        </Button>
                    ) : (
                        <DynamicConnectButton
                            buttonContainerClassName="custom-connect-btn-container"
                            buttonClassName="custom-connect-btn"
                        >
                            Connect Wallet
                        </DynamicConnectButton>
                    )}
                </div>
                <div className="justify-center mt-8 hidden md:flex">
                    <AppText
                        className="text-gray-600 text-lg"
                        text={`© ${new Date().getFullYear()} Powered by DexPay`}
                    />
                </div>
            </Container>

            <Container className="block md:hidden">
                <div className="flex flex-col items-center space-y-3 mt-8">
                    {isAuthenticated && isLoggedIn ? (
                        <Button
                            size="large"
                            onClick={handleNext}
                            fullWidth
                            className="bg-white rounded-lg text-black capitalize mb-3"
                        >
                            Proceed
                        </Button>
                    ) : (
                        <DynamicConnectButton
                            buttonContainerClassName="custom-connect-btn-container"
                            buttonClassName="custom-connect-btn"
                        >
                            Connect Wallet
                        </DynamicConnectButton>
                    )}
                </div>
                <div className="flex justify-center mt-8">
                    <AppText
                        className="text-gray-600 text-lg"
                        text={`© ${new Date().getFullYear()} Powered by DexPay`}
                    />
                </div>
            </Container>
            {openConnectModal && stepComponent(currentStep)}
        </div>
    );
};

export default SwapToken;
