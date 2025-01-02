/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button, Checkbox, CircularProgress, Container, Divider, Radio, } from "@mui/material"; //Switch
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useDisclosure from "@/utils/useDisclosure";
import MakeRepayment from "@/components/instantBuy/MakeRepayment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { convertToBigInt, convertToCurrency, fetchTokenAddress, getCurrencySymbol, shortenedAddress } from "@/utils"; //convertToBigInt
import PaymentOptionModal from "@/components/instantBuy/modals/paymentOptionModal";
import AddPaymentModal from "@/components/instantBuy/modals/AddPaymentModal";
import { useHandleBestRate, useTradeExpressOrder } from "@/services/mutations/swap.mutations";
import useMessageSignature from "@/hooks/useSignatureMessage";
import AppText from "@/components/AppText";
import ConfirmPayment from "@/components/instantBuy/modals/confirmPayment";
import { useAccount, useChainId } from "wagmi";
import { updateExpressOrderData } from "@/store/slices/traderSlice";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/services/mutations/logins";
import MobileWalletModal from "@/components/instantBuy/modals/MobileWallet";
import { readContract } from "wagmi/actions";
import tokenAbi from "../../token-abi.json";
import { config } from "@/utils/config";
import Allowance from "@/components/instantBuy/modals/Allowance";


const ReviewBuyTradePage = () => {
    const { data: profile } = useGetProfile();
    const router = useRouter()
    const { address } = useAccount();
    const chainId = useChainId();
    const { expressOrderData, paymentAccount } = useAppSelector(
        (state) => state.tradeReducer
    );
    const dispatch = useAppDispatch();

    const { requestSelf, getVerifiedSignature } = useMessageSignature();

    const [numericAllowance, setNumericAllowance] = useState(0);
    const [selectedValue, setSelectedValue] = React.useState("bankTransfer");
    const [check, setCheck] = useState(false);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { mutateAsync: bestRate } = useHandleBestRate()
    const { mutateAsync: tradeExpressOrder, isPending } = useTradeExpressOrder()
    const { assets } = useAppSelector((state) => state.countryReducer);

    const {
        isOpen: isOpenAllowance,
        onClose: onOpenAllowanceClose,
        onOpen: onOpenAllowance,
    } = useDisclosure();

    const {
        isOpen: isOption,
        onClose: onOptionClose,
        onOpen: onOptionOpen,
    } = useDisclosure();
    const {
        isOpen: isOpenMobileWallet,
        onClose: onCloseMobileWallet,
        onOpen: onOpenMobileWallet,
    } = useDisclosure();
    const { isOpen: isOpenBank, onClose: onCloseBank, onOpen: onOpenBank } = useDisclosure();
    const {
        isOpen: isConfirmPayment,
        onClose: onCloseConfirmPayment,
        onOpen: onOpenConfirmPayment,
    } = useDisclosure();
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(event.target.checked);
    };

    const checkRate = async () => {
        try {
            let body;
            if (
                expressOrderData?.orderType == "buy" &&
                expressOrderData?.inputField == "tradeAmount"
            ) {
                body = {
                    fiat: Number(expressOrderData?.amount),
                    type: expressOrderData?.orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            } else if (
                expressOrderData?.orderType == "buy" &&
                expressOrderData?.inputField == "receiveAmount"
            ) {
                body = {
                    quantity: Number(expressOrderData?.amountToReceive),
                    type: expressOrderData?.orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            } else if (
                expressOrderData?.orderType == "sell" &&
                expressOrderData?.inputField == "tradeAmount"
            ) {
                body = {
                    quantity: Number(expressOrderData?.amount),
                    type: expressOrderData?.orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            } else if (
                expressOrderData?.orderType == "sell" &&
                expressOrderData?.inputField == "receiveAmount"
            ) {
                body = {
                    fiat: Number(expressOrderData?.amountToReceive),
                    type: expressOrderData?.orderType.toUpperCase(),
                    chain: profile?.data?.chain,
                };
            }

            const response = await bestRate({ asset: expressOrderData?.asset, data: body })
            if (!response?.data?.price) {
                toast.error(
                    "AD is no longer available for trade, Please go back and retry"
                );
                return;
            }

            if (response) {
                if (response?.data?.price !== expressOrderData?.price) {
                    toast.error("Ooops Rate has changed, Click Proceed to continue", {
                        id: "error",
                    });
                    dispatch(
                        updateExpressOrderData({
                            ...expressOrderData,
                            amountToReceive:
                                expressOrderData?.orderType == "sell"
                                    ? String(
                                        Number(expressOrderData?.amount) /
                                        Number(response.data.price)
                                    )
                                    : String(
                                        Number(expressOrderData?.amount) *
                                        Number(response.data.price)
                                    ),
                        })
                    );

                    return true;
                } else {
                    return false;
                }
            }
            /* console.log("this is response " + JSON.stringify(response)); */
        } catch (error: any) {
            /* console.log("this is error " + JSON.stringify(error)); */
            if (error?.response?.data?.message)
                toast.error(error?.response?.data?.message, {
                    id: "error",
                });
            return true;
        }
    };

    const handleContinueBuy = async () => {
        // onOpen();
        const checkResult = await checkRate();
        if (checkResult) {
            return;
        }
        try {
            const validUntil = Math.floor(Date.now() / 1000 + 3600);
            const signatureMessage = {
                message: await requestSelf(address as any, validUntil),
                signature: await getVerifiedSignature(
                    address as any,
                    chainId,
                    validUntil
                ),
            };
            let body;
            if (
                expressOrderData?.orderType == "buy" &&
                expressOrderData?.inputField == "tradeAmount"
            ) {
                body = {
                    fiat: Number(expressOrderData?.amount),
                };
            } else if (
                expressOrderData?.orderType == "buy" &&
                expressOrderData?.inputField == "receiveAmount"
            ) {
                body = {
                    quantity: Number(expressOrderData?.amountToReceive),
                };
            } else if (
                expressOrderData?.orderType == "sell" &&
                expressOrderData?.inputField == "tradeAmount"
            ) {
                body = {
                    quantity: Number(expressOrderData?.amount),
                };
            } else if (
                expressOrderData?.orderType == "sell" &&
                expressOrderData?.inputField == "receiveAmount"
            ) {
                body = {
                    fiat: Number(expressOrderData?.amountToReceive),
                };
            }
            const response = await tradeExpressOrder({
                type: expressOrderData?.orderType.toUpperCase(),
                asset: expressOrderData?.asset,
                signatureMessage,
                ...body,
            });
            if (response) {
                toast.success("Successfully created a buy order, please make payment", {
                    id: "success",
                });
                router.replace(`/review?orderId=${response.data._id}`, undefined);
                onOpen();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });
        }
    };

    const fetchAllowance = async () => {
        const data = await readContract(config, {
            address: fetchTokenAddress(
                assets,
                expressOrderData?.asset
            ) as `0x${string}`,
            abi: tokenAbi,
            functionName: "allowance",
            args: [address, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS],
        });

        setNumericAllowance(data as number);
    };

    useEffect(() => {
        fetchAllowance();
    }, [open]);

    const handleContinueSell = async () => {
        // onOpenConfirmPayment()

        const checkResult = await checkRate();
        if (checkResult) {
            return;
        }

        try {
            if (
                expressOrderData.amount &&
                convertToBigInt(expressOrderData.amount) > numericAllowance
            ) {
                onOpenAllowance();
                return;
            } else {
                const validUntil = Math.floor(Date.now() / 1000 + 3600);
                const signatureMessage = {
                    message: await requestSelf(address as any, validUntil),
                    signature: await getVerifiedSignature(
                        address as any,
                        chainId,
                        validUntil
                    ),
                };
                const response = await tradeExpressOrder(
                    {
                        type: expressOrderData?.orderType.toUpperCase(),
                        asset: expressOrderData?.asset,
                        quantity: Number(expressOrderData?.amount),
                        paymentAccountId: expressOrderData?.paymentAccountId,
                        signatureMessage,
                    }
                );

                if (response.data) {
                    toast.success(
                        "Successfully created a sell order, please wait for buyer to make payment",
                        {
                            id: "success",
                        }
                    );
                    router.replace(`/review?orderId=${response.data._id}`, undefined);
                    onOpenConfirmPayment()
                }
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });
        }
    };
    return (
        <Container className="lg:w-[50%] xl:w-[35%]">
            <Button onClick={() => router.back()} className="text-white" startIcon={<ArrowBackIcon />}>
                Back
            </Button>

            <div className="px-4 py-8 rounded-lg w-full h-auto bg-gray-900">
                <div className="flex space-x-4 justify-between items-center">
                    <AppText

                        text={`Review ${expressOrderData?.orderType} trade`}
                        className="font-semibold text-sm"
                    />
                    <AppText
                        text={`1.00 ${expressOrderData?.asset} = ${getCurrencySymbol(
                            expressOrderData?.fiat
                        )}${convertToCurrency(expressOrderData?.price)} `}
                        className="font-medium text-gray-400 text-xs sm:text-sm"
                    />
                </div>
                <Divider className="mt-6" />

                <div className="my-4 flex flex-col space-y-4">
                    <div className="flex justify-between">
                        <AppText className="text-xs sm:text-sm" text={`Amount to ${expressOrderData?.orderType}`} />
                        <AppText
                            className="text-xs sm:text-sm"
                            text={`${expressOrderData?.orderType === 'buy'
                                ? `${expressOrderData?.fiat} ${convertToCurrency(expressOrderData?.amount)}`
                                : `${convertToCurrency(expressOrderData?.amount)} ${expressOrderData?.asset}`} `}
                        />
                    </div>
                    <div className="flex justify-between">
                        <AppText className="text-xs sm:text-sm" text="Amount to receive" />
                        <AppText
                            className="text-xs sm:text-sm"
                            text={`${expressOrderData?.orderType === 'buy'
                                ? `${convertToCurrency(expressOrderData?.amountToReceive)} ${expressOrderData?.asset}`
                                : ` ${expressOrderData?.fiat} ${convertToCurrency(expressOrderData?.amountToReceive)}`} `}
                        />
                    </div>
                    {expressOrderData?.orderType === "buy" ? (
                        <div className="flex justify-between">
                            <AppText className="text-xs sm:text-sm" text="Buy to" />
                            <AppText
                                className="text-xs sm:text-sm"
                                text={`${shortenedAddress(expressOrderData?.walletAddress) ?? "N/A"}`}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-between">
                            <AppText className="text-xs sm:text-sm" text="Sell from" />
                            <AppText
                                className="text-xs sm:text-sm"
                                text={`${shortenedAddress(expressOrderData?.walletAddress) ?? "N/A"}`}
                            />
                        </div>
                    )}
                    <div className="flex justify-between">
                        <AppText className="text-xs sm:text-sm" text="Fee" />
                        <AppText
                            className="text-xs sm:text-sm"
                            text={`${expressOrderData?.serviceFee} ${expressOrderData?.asset}`}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        {/* <AppText text='Payment Method' />
                       <div className='flex items-center space-x-2'>
                            <AppText text='Auto-payout' className='font-thin' />
                            <AppText text='Wallet Bal: ₦200,000.00' className='text-gray-500 text-sm' />

                            <Switch
                                // checked={useDarkTheme}
                                inputProps={{ "aria-label": "Dark Mode" }}
                            // onChange={onChange}
                            ></Switch>
                        </div> */}
                    </div>
                    {expressOrderData?.orderType === "buy" ? (
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div
                                onClick={() => setSelectedValue("bankTransfer")}
                                className="flex cursor-pointer items-center sm:items-start w-full bg-gray-700 py-2 px-1 border border-solid border-gray-500 rounded-md"
                            >
                                <Radio
                                    size="small"
                                    checked={selectedValue === "bankTransfer"}
                                    onChange={handleChange}
                                    value="bankTransfer"
                                    name="radio-buttons"
                                    inputProps={{ "aria-label": "bankTransfer" }}
                                />
                                <div>
                                    <AppText text="Bank Transfer" className="font-medium text-xs sm:text-base" />
                                    <AppText
                                        text="Pay with your bank"
                                        className="font-thin text-gray-400 text-sm"
                                    />
                                </div>
                            </div>
                            <div
                                onClick={() => setSelectedValue("mobileWallet")}
                                className="flex cursor-pointer items-center sm:items-start w-full bg-gray-700 py-2 px-1 border border-solid border-gray-500 rounded-md"
                            >
                                <Radio
                                    size="small"
                                    checked={selectedValue === "mobileWallet"}
                                    onChange={handleChange}
                                    value="mobileWallet"
                                    name="radio-buttons"
                                    inputProps={{ "aria-label": "mobileWallet" }}
                                />
                                <div>
                                    <AppText text="Mobile Wallet" className="font-medium text-xs sm:text-base" />
                                    <AppText
                                        text="Send from your mobile wallet"
                                        className="font-thin text-gray-400 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : !paymentAccount?.bankName ? (
                        <div
                            onClick={onOptionOpen}
                            className="px-4 py-2 border border-solid rounded-md cursor-pointer border-[#344054] flex flex-col md:flex-row gap-x-3 bg-[#1D2939]"
                        >
                            <AppText
                                text="Select a method to receive payment"
                                className="font-thin text-[#F41449] text-xs md:text-sm"
                            />
                            <AppText
                                text="(Manual Payment)"
                                className="font-thin text-gray-400  text-xs md:text-sm"
                            />
                        </div>
                    ) : null}
                    {expressOrderData?.orderType == "sell" && paymentAccount?.bankName ? (
                        <div
                            onClick={onOptionOpen}
                            className="flex items-center cursor-pointer my-3 space-x-4 border border-gray-600 bg-[#1e2939] border-solid p-3 rounded-lg mt-6"
                        >
                            <div className="font-semibold w-full">
                                <div className="flex justify-between ">
                                    <AppText
                                        className="text-sm text-gray-400"
                                        text={paymentAccount?.bankName}
                                    />
                                    <AppText
                                        text="Select another method"
                                        className="font-thin text-[#F41449] text-sm"
                                    />
                                </div>
                                <div className="flex gap-x-3 mt-1">
                                    <AppText
                                        className="text-sm text-gray-400"
                                        text={paymentAccount?.accountNumber}
                                    />
                                    <AppText className="text-sm" text={paymentAccount?.accountName} />
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className=" my-3 items-center hidden md:flex">
                        <Checkbox
                            className="text-[#F41449]"
                            checked={check}
                            onChange={handleChecked}
                        />
                        <AppText text="I agree to the" className="font-medium text-xs sm:text-sm mr-1" />
                        <AppText text="Terms of Trade" className="font-medium underline text-xs sm:text-sm" />
                    </div>

                    <section className="flex-col-reverse sm:flex-row gap-4 w-full mt-8 hidden md:flex">
                        <Button
                            onClick={() => router.back()}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-gray-700 outline-gray-700 rounded-lg text-white capitalize w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={!check || (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName)}
                            onClick={() => {
                                if (!check) {
                                    toast.error("Agree to terms of trade");
                                    return;
                                }
                                if (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName) {
                                    toast.error("Select a payment account");
                                    return;
                                }
                                if (expressOrderData.orderType === 'buy') {
                                    handleContinueBuy()
                                    return
                                } else if (expressOrderData.orderType === 'sell') {
                                    handleContinueSell()
                                }
                            }}
                            variant="outlined"
                            fullWidth
                            size="large"
                            // className={`bg-white rounded-lg text-[#0A0F19] capitalize ${!check || (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName) ? 'cursor-not-allowed' : 'cursor-pointer'}
                            //     ${!check ? "disabled:bg-gray-500 disabled:text-gray-900" : ""}`}
                            className={`bg-white rounded-lg text-[#0A0F19] capitalize ${!check || (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName) ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${!check ? "disabled:bg-gray-500 disabled:text-gray-900" : ""}`}
                        >
                            {" "}
                            Proceed to {expressOrderData.orderType === "buy" ? "buy" : "sell"}
                            {isPending && (
                                <CircularProgress
                                    sx={{
                                        color: "#111217",
                                        opacity: "0.4",
                                        marginLeft: "10px",
                                        verticalAlign: "middle",
                                    }}
                                    size={15}
                                />
                            )}
                        </Button>
                    </section>
                </div>
                <div className="justify-center mt-10 hidden md:flex">
                    <AppText
                        className="text-gray-600 text-lg"
                        text={`© ${new Date().getFullYear()} Powered by DexPay`}
                    />
                </div>

                {/* Numerical Allowance */}
                <Allowance
                    isOpen={isOpenAllowance}
                    onClose={onOpenAllowanceClose}
                    asset={expressOrderData?.asset}
                    selectedValue={'0'}
                />

                {/* make payment which is for orderType of "buy" */}
                <MakeRepayment
                    onOpen={onOpen}
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpenConfirmPayment={onOpenConfirmPayment}
                />

                {/* for sell this comes first cause we don't need makePayment component */}
                <ConfirmPayment
                    onOpenConfirmPayment={onOpenConfirmPayment}
                    isConfirmPayment={isConfirmPayment}
                    onCloseConfirmPayment={onCloseConfirmPayment}
                />
                <PaymentOptionModal
                    isOption={isOption}
                    onOptionClose={onOptionClose}
                    openBankDetails={onOpenBank}
                    onOpenMobileWallet={onOpenMobileWallet}
                />
                <AddPaymentModal isAdd={isOpenBank} onAddClose={onCloseBank} />
                <MobileWalletModal isOpenMobileWallet={isOpenMobileWallet} onCloseMobileWallet={onCloseMobileWallet} />
            </div>


            <div className="p-2 mt-3 rounded-lg w-full h-auto block md:hidden ">
                <div className="flex items-center">
                    <Checkbox
                        className="text-[#F41449]"
                        checked={check}
                        onChange={handleChecked}
                    />
                    <AppText text="I agree to the" className="font-medium text-sm sm:text-sm mr-1" />
                    <AppText text="Terms of Trade" className="font-medium underline text-sm sm:text-sm" />
                </div>

                <section className="gap-2 w-full mt-1 flex">
                    <Button
                        onClick={() => router.back()}
                        variant="outlined"
                        fullWidth
                        size="medium"
                        className="py-2 bg-gray-700 outline-gray-700 rounded-lg text-white capitalize w-full"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!check}
                        onClick={() => {
                            if (!check) {
                                toast.error("Agree to terms of trade");
                                return;
                            }
                            if (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName) {
                                toast.error("Select a payment account");
                                return;
                            }
                            if (expressOrderData.orderType === 'buy') {
                                handleContinueBuy()
                                return
                            } else if (expressOrderData.orderType === 'sell') {
                                handleContinueSell()
                            }
                        }}
                        variant="outlined"
                        fullWidth
                        size="medium"
                        className={`bg-white rounded-lg text-[#0A0F19] capitalize ${!check || (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName) ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${!check || (expressOrderData?.orderType == "sell" && !paymentAccount?.bankName) ? "disabled:bg-gray-500 disabled:text-gray-900" : ""}`}
                    >
                        {" "}
                        Proceed to {expressOrderData.orderType === "buy" ? "buy" : "sell"}
                        {isPending && (
                            <CircularProgress
                                sx={{
                                    color: "#111217",
                                    opacity: "0.4",
                                    marginLeft: "10px",
                                    verticalAlign: "middle",
                                }}
                                size={15}
                            />
                        )}
                    </Button>
                </section>
                <div className="flex justify-center mt-3">
                    <AppText
                        className="text-gray-600 text-sm"
                        text={`© ${new Date().getFullYear()} Powered by DexPay`}
                    />
                </div>
            </div>
        </Container>
    );
};

export default ReviewBuyTradePage;
