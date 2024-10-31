/* eslint-disable @typescript-eslint/no-explicit-any */
"use Client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Sync from "@/app/assets/icons/sync";
import Grid from "@mui/material/Grid2";
import { Box, Button, CircularProgress, FormControl, MenuItem, Typography } from "@mui/material";
// import AppInput from "../AppInput";
import SwapIcon from "@/app/assets/icons/swap";
import AppText from "../AppText";
import {
    DynamicConnectButton,
    useDynamicContext,
    useIsLoggedIn,
    useUserWallets,
} from "@dynamic-labs/sdk-react-core";
import {
    useGetAddress,
    useGetNonce,
    useGetProfile,
    useHandleSocialLogin,
} from "@/services/mutations/logins";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { SiweMessage, generateNonce } from "siwe";
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
    paymentMethods,
    setAuthToken,
    useBreakPoints,
} from "@/utils";
import toast from "react-hot-toast";
import { resetAddressState, updateAddressData } from "@/store/slices/addressSlice";
import ConnectWallet from "../GeneralModals/ConnectWallet";
import VerifySignatureDialog from "../GeneralModals/VerifySignatureDialog";
import EmailUi from "../GeneralModals/EmailUi";
import EmailVerify from "../GeneralModals/EmailVerify";
import SwitchNetwork from "../GeneralModals/SwitchNetwork";
import { RootState } from "@/store/store";
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
import { updateExpressOrderData } from "@/store/slices/traderSlice";
import { LabelStyle } from "../GeneralModals/ModalStyles";
import AppSelect from "../AppSelect";

type Props = {
    handleClick: () => void;
};
const SwapToken = ({ handleClick }: Props) => {
    const isLoggedIn = useIsLoggedIn();
    const { sm } = useBreakPoints();
    const { isAuthenticated, user } = useAppSelector((state: RootState) => state.userReducer);
    const { paymentAccount, expressOrderData } = useAppSelector(
        (state) => state.tradeReducer
    );
    const { defaultCurrency } = useAppSelector((state) => state.countryReducer);
    const { data: currencies } = useFetchCurrencies();
    const { data: assets } = useFetchAssets();
    const { data: profile } = useGetProfile()
    const dispatch = useAppDispatch();
    const userWallets = useUserWallets();
    const { primaryWallet } = useDynamicContext();
    const [amountCurrencies, setAmountCurrencies] = useState<any>();
    const [amountToReceiveCurrencies, setAmountToReceiveCurrencies] = useState<any>();
    const [currentStep, setCurrentStep] = useState("");
    const [selectedValue] = useState("");
    const [openConnectModal, setOpenConnectModal] = useState(false);
    const [emailVerified, setEmailVerified] = useState(true);
    const [maxBalance, setMaxBalance] = useState(0);
    const [price, setPrice] = useState("");
    const [receiveAmount, setReceiveAmount] = useState("0");
    const [tradeAmount, setTradeAmount] = useState("0");
    const [field, setField] = useState("");
    const classes = LabelStyle()

    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    // const open = Boolean(anchorEl);

    const { fee } = useFee(user.verifiedCheck);
    const [realTradeAmount] = useDebounce(tradeAmount, 1000);
    const [realReceiveAmount] = useDebounce(receiveAmount, 1000);
    const chainId = useChainId();
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    const { mutateAsync: socialLogin } = useHandleSocialLogin();
    const {
        data: nonceData,
        error: nonceError,
        isError: isNonceError,
    } = useGetNonce(primaryWallet?.address);
    const { data: addressData, isError: isGetAddressError } = useGetAddress(primaryWallet?.address);
    const { mutateAsync: handleBestRate, isPending: bestRatePending } = useHandleBestRate()

    const [formData, setFormData] = useState({
        orderType: expressOrderData?.orderType || "buy",
        amount: expressOrderData?.amount || "",
        amountToReceive: "",
        fiat: expressOrderData?.fiat || defaultCurrency,
        asset:
            expressOrderData?.asset !== ""
                ? expressOrderData?.asset
                : assets?.[0]?.name || (typeof window !== "undefined" && localStorage.getItem("defaultAsset")),

    });

    const { orderType, fiat, asset } = formData;
    const { mutateAsync: getAmountToReceive, isPending: amountToReceivePending } = useGetAmountToReceive()
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    // const handleCloseDialog = () => {
    //     setOpenDialog(false);
    // };
    const handleDisconnect = () => {
        window.localStorage.removeItem("provider");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("defaultAsset");
        dispatch(resetUserState());
        dispatch(resetAddressState());
        // dispatch(resetTradeState());
        dispatch(updateIsAuth(false));
        // handleCloseDialog();
        // handleClose();
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
    const publicAddresses = userWallets.map((el) => ({ address: el.address, chain: el.chain }));
    const handleSocialSignUp = async () => {
        try {
            const dynamicEmail = localStorage.getItem("dynamicEmail") || "";
            const dynamicAddress = localStorage.getItem("dynamicAddress") || "";
            const dynamicAuthToken = localStorage.getItem("dynamicAuthToken") || "";
            if (!primaryWallet) return;

            const message = new SiweMessage({
                domain: "app.dexpay.io",
                address: primaryWallet?.address,
                uri: origin,
                nonce: generateNonce(),
                version: "1",
                chainId: chainId,
            });
            const signatureMessage = message.prepareMessage();
            await primaryWallet.signMessage(signatureMessage);

            const req = await socialLogin({
                publicAddresses: publicAddresses,
                emailAddress: dynamicEmail,
                referredBy: "socialLogin",
                dlToken: dynamicAuthToken,
            });
            const res = req?.data;

            dispatch(updateEmailAddress(dynamicEmail));
            dispatch(updateWalletAddress(dynamicAddress));
            if (res) console.log("Seee<>>>>>>>>>> " + JSON.stringify(res));

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
            isConnected &&
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
                    dispatch(updateNonce(nonceData?.data?.nonce))
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
                };
            } else if (orderType == "buy" && field == "receiveAmount") {
                body = {
                    quantity: Number(realReceiveAmount),
                    type: orderType.toUpperCase(),
                };
            } else if (orderType == "sell" && field == "tradeAmount") {
                body = {
                    quantity: Number(realTradeAmount),
                    type: orderType.toUpperCase(),
                };
            } else if (orderType == "sell" && field == "receiveAmount") {
                body = {
                    fiat: Number(realReceiveAmount),
                    type: orderType.toUpperCase(),
                };
            }
            const response = await handleBestRate({ asset: asset, data: body })
            if (!response?.data?.price) {
                toast.error("No ads match");
                return;
            }
            setPrice(response.data.price);
            // Call Express Entry calculator
            const calculate = async () => {
                const res = await expressEntryCalculator(
                    {
                        inputfield: field,
                        tradeAmount: realTradeAmount,
                        receiveAmount: realReceiveAmount,
                        orderType,
                        price: response.data.price,
                        orderFee: fee.orderFee
                    }
                );

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
            const response = await getAmountToReceive({ asset, orderType })
            setPrice(response.data.price);
        } catch (error: any) {
            if (error?.response?.data?.message)
                toast.error(error.response.data.message, {
                    id: "error",
                });
        }
    }

    // ALL USEEFFECTS //

    useEffect(() => {
        setFormData({
            orderType: expressOrderData?.orderType || "buy",
            amount: expressOrderData?.amount || "",
            amountToReceive: "",
            fiat: expressOrderData?.fiat || defaultCurrency,
            asset:
                expressOrderData?.asset !== ""
                    ? expressOrderData?.asset
                    : (typeof window !== "undefined" && localStorage.getItem("defaultAsset")) || assets?.[0]?.name,
        })
    }, [assets, expressOrderData]);

    useEffect(() => {
        receiveAmountFn();
    }, [asset]);

    useEffect(() => {
        if (profile?.data?.user) {
            dispatch(updateUser(profile?.data?.user));
            dispatch(updateIsAuth(true))
        } else {
            dispatch(updateIsAuth(false))
        }
    }, [profile?.data?.user])

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

    // GET TOKEN BALANCE
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
                // console.log("receiveamount tigger");
                fetchBestRateforAmount();
            } else {
                setTradeAmount("");
            }
        }
    }, [realReceiveAmount]);

    // useEffect(() => {
    //     // Fetch Rates on tab change
    //     getAmountToRecieve();
    // }, [orderType]);

    // END USEEFFECTS //

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
        // if (user.progress == 0) {
        //     toast.error("Please update your profile first", {
        //         id: "error",
        //     });
        //     setOpen(true);
        //     return;
        // }
        if (!tradeAmount) {
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
            })
        );

        // if ordertype is buy set next step to 2
        if (orderType == "buy") {
            setCurrentStep("4");
        }
        // if ordertype is sell
        else {
            // if no default payment account is found redirect to add payment page
            if (!paymentAccount._id) {
                setCurrentStep("3");
            } else {
                setCurrentStep("4");
            }
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
                        emailVerified={emailVerified}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        open={openConnectModal}
                        onClose={handleCloseConnectModal}
                        selectedValue={selectedValue}
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
    return (
        <>
            <Box
                sx={{
                    width: "30%",
                    mt: 3,
                    p: 3,
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
                        <div className="text-md">Amount to buy</div>
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
                                }}
                                maxLimit={true}
                                maxInputAmount={
                                    orderType == "buy"
                                        ? getMaxFiatOrderAmount()
                                        : getMaxCryptoOrderAmount(user?.verifiedCheck)
                                }
                                errorText={
                                    tradeAmount !== "0.00" &&
                                        orderType == "sell" &&
                                        Number(tradeAmount) < getMinimumAdLimit()
                                        ? `Minimum order amount is ${getMinimumAdLimit()}`
                                        : tradeAmount !== "0" &&
                                            orderType == "buy" &&
                                            Number(tradeAmount) < getMinimumAdLimit() * Number(price)
                                            ? `Minimum order amount is ${convertToCurrency(
                                                getMinimumAdLimit() * Number(price)
                                            )}`
                                            : orderType == "sell" && Number(tradeAmount) > Number(maxBalance)
                                                ? `Insufficient balance`
                                                : null
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 5, sm: 3 }}>
                            <TextSelect
                                value={orderType === "buy" ? fiat : asset}
                                onChange={orderType === "buy" ? onChangeFiat : onChangeAsset}
                            >
                                {amountCurrencies?.map((option: any) => (
                                    <MenuItem
                                        key={option?.currencyCode || option?.name}
                                        value={option?.currencyCode || option?.name}
                                    >
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Image
                                                src={getCurrencyImage(option?.currencyCode || option?.name)}
                                                alt=""
                                                width={24}
                                                height={24}
                                                style={{ marginRight: "10px" }}
                                            />{" "}
                                            {option?.currencyCode || option?.name}
                                        </div>
                                    </MenuItem>
                                ))}
                            </TextSelect>
                        </Grid>
                    </Grid>

                    <div className="mt-2 text-sm text-white flex items-center ">
                        1.00 {asset} = {fiat} {convertToCurrency(price)}{" "}
                        <Sync onClick={() => refreshRate()} className="ml-2 mr-1 cursor-pointer" />
                        {/* {!sm && <br />} */}
                        Est Fee = ${convertToCurrency(fee.orderFee)}
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
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <Image
                                                        src={getCurrencyImage(option?.name || option?.currencyCode)}
                                                        alt=""
                                                        width={24}
                                                        height={24}
                                                        style={{ marginRight: "10px" }}
                                                    />{" "}
                                                    {option?.name || option?.currencyCode}
                                                </div>
                                            </MenuItem>
                                        )
                                    })}

                                </TextSelect>
                            </Grid>
                        </Grid>
                    </div>

                </div>
                <div className={classes.labelDivSecond}>
                    <label
                        htmlFor="amount"
                        className="text-sm font-medium text-white mb-1 flex justify-between items-center"
                    >
                        <div className="text-md">Sell From</div>
                    </label>
                    <FormControl fullWidth>
                        <AppSelect
                            name="paymentMode"
                            value="Bank transfer"
                            defaultValue="Bank transfer"
                        >
                            {paymentMethods.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </AppSelect>
                    </FormControl>
                </div>
                <div className="flex flex-col items-center space-y-3 mt-8">
                    {isAuthenticated && isLoggedIn ?
                        (<Button size='large' onClick={handleNext} fullWidth className="bg-white rounded-xl text-black capitalize mb-3">
                            Proceed
                        </Button>)
                        : (<DynamicConnectButton
                            buttonContainerClassName="custom-connect-btn-container"
                            buttonClassName="custom-connect-btn"
                        >
                            Connect Wallet
                        </DynamicConnectButton>)}
                </div>
                <div className="flex justify-center mt-8">
                    <AppText
                        className="text-gray-600 text-lg"
                        text={`© ${new Date().getFullYear()} Powered by DexPay`}
                    />
                </div>
            </Box>
            {openConnectModal && stepComponent(currentStep)}
        </>
    );
};

export default SwapToken;
