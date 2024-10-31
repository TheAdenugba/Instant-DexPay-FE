/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { ConnectWalletStyles } from "./ModalStyles";
import { setAuthToken, useBreakPoints } from "@/utils";
import { SimpleDialogProps } from "@/store/models/modalProps";
import Assets from "@/utils/assets";
import { connectors, getInjection } from "@/utils/connectors";
import { generateNonce, SiweMessage } from "siwe";
import { useAuthenticateAddress, useGetAddress, useRequestOtp } from "@/services/mutations/logins";
import toast from "react-hot-toast";
import { updateIsAuth, updateUser, updateWalletStatus } from "@/store/slices/userSlice";

import { useWeb3React } from "@web3-react/core";
import { updateAddressData, updateSignature } from "@/store/slices/addressSlice";
import { useAppDispatch } from "@/store/hooks";



const ConnectWallet = ({ onClose, open, selectedValue, setCurrentStep, }: Omit<SimpleDialogProps, 'onClickSwitch'>) => {
    const { activate, active, account, library, chainId } = useWeb3React();
    const { CANCELLED, METAMASK, WALLET_CONNECT, COINBASE_LOGO } = Assets;
    const { sm } = useBreakPoints();
    const dispatch = useAppDispatch();
    const { mutateAsync: handleAuthenticate } = useAuthenticateAddress()
    const { mutateAsync: handleOTP } = useRequestOtp()
    const { data: addressData, isError: isGetAddressError } = useGetAddress(account)
    const classes = ConnectWalletStyles()


    const handleClose = () => {
        onClose(selectedValue);
    };

    const setProvider = (type: string) => {
        window.localStorage.setItem("provider", type);
    };

    const authenticateAddress = async (
        signature: string,
        signatureMessage: string
    ) => {
        try {
            const response = await handleAuthenticate({
                publicAddress: account,
                signature: signature,
                message: signatureMessage,
            })
            const res = response.data;

            if (res.auth) {
                localStorage.setItem("token", res.auth.accessToken);
                localStorage.setItem("refreshToken", res.auth.refreshToken);
                dispatch(updateIsAuth(true));
                dispatch(updateWalletStatus(res.status));
                dispatch(updateUser(res.user));
                setAuthToken(res.auth.accessToken);
            }
        } catch (error: any) {
            dispatch(updateIsAuth(false));
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });
            //setCurrentStep("6");
        }
    };

    function createSiweMessage(address: string) {
        const message = new SiweMessage({
            domain: "app.dexpay.io",
            address,
            /*       statement: "I accept the DexPay Protocol Terms of Service.", */
            uri: origin,
            nonce: generateNonce(),
            version: "1",
            chainId: chainId,
        });
        return message.prepareMessage();
    }

    const OTPHandler = async (address: unknown) => {
        try {
            // if emailVerified is false, call request otp and redirect to otp modal
            await handleOTP(address)
            setCurrentStep("3");

        } catch (error: any) {
            toast.error(error.message, {
                id: "error",
            });
        }
    }

    const signMessage = async () => {
        if (!library) return;
        try {
            const signatureMessage = createSiweMessage(account as string);
            const signature = await library.provider.request({
                method: "personal_sign",
                params: [signatureMessage, account],
            });
            if (signature) {
                dispatch(updateSignature({ signature, signatureMessage }));
                authenticateAddress(signature, signatureMessage);
            }
        } catch (error: any) {
            // console.log(error);
            toast.error(error.message, {
                id: "error",
            });
            return;
        }
    };
    const signMessageTwo = async () => {
        if (!library) return;
        try {
            const signatureMessage = createSiweMessage(account as string);
            const signature = await library.provider.request({
                method: "personal_sign",
                params: [signatureMessage, account],
            });
            if (signature) {
                dispatch(updateSignature({ signature, signatureMessage }));
                OTPHandler(account)
            }
        } catch (error: any) {
            toast.error(error.message, {
                id: "error",
            });
            return;
        }
    };

    useEffect(() => {
        if (active && account) {
            dispatch(updateAddressData(addressData?.data));
            if (addressData?.data?.emailVerified && addressData?.data?.status == "ACTIVE") {
                signMessage();
                // signMessage(nonceData?.data?.nonce);
                return
            }
            else if (!addressData?.data?.emailVerified && addressData?.data?.status == "PENDING") {
                signMessageTwo();
                return
                // signMessageTwo(nonceData?.data?.nonce);
            }
        }
    }, [active, account]);

    useEffect(() => {
        if (isGetAddressError === true) setCurrentStep("2");
    }, [isGetAddressError])
    return (
        <Dialog
            className={classes.dialog}
            onClose={() => handleClose()}
            open={open}
            sx={{
                width: sm ? "100%" : "100%",
            }}
            classes={{
                paper: classes.dialogPaperDark,
            }}
        >
            <DialogTitle>
                <div className={classes.titleDiv}>
                    <Typography
                        variant="body2"
                        fontSize={sm ? "21px" : "16px"}
                        className={classes.titleText}
                    >
                        Connect a wallet
                    </Typography>
                    <Image
                        width={18}
                        height={18}
                        onClick={() => {
                            handleClose();
                        }}
                        style={{
                            cursor: "pointer",
                        }}
                        src={CANCELLED}
                        alt="cancelled"
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={classes.walletDiv}>
                    <div
                        className={classes.walletItem}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (window.ethereum) {
                                toast.loading("Connecting...", {
                                    id: "connecting",
                                });
                            } else {
                                toast.error("Install metamask", {
                                    id: "error",
                                });
                            }
                            activate(connectors.injected);
                            setProvider("injected");
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={
                                    getInjection() && getInjection().icon
                                        ? getInjection().icon
                                        : METAMASK
                                }
                                alt="metamask"
                                width={48}
                                height={48}
                            />
                            <Typography variant="h6" className={classes.walletName}>
                                {getInjection() && getInjection().name}
                            </Typography>
                        </div>
                        {/* <CircularProgress
              sx={{
                color: "white",
                marginLeft: "10px",
                verticalAlign: "middle",
              }}
              size={20}
            /> */}
                    </div>
                    <div
                        className={classes.walletItem}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            activate(connectors.walletConnect);
                            setProvider("walletConnect");
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={WALLET_CONNECT}
                                alt="wallet-connect-logo"
                                width={48}
                                height={48}
                            />
                            <Typography variant="h6" className={classes.walletName}>
                                Wallet Connect
                            </Typography>
                        </div>
                        {/*  <CircularProgress
              sx={{
                color: "white",
                marginLeft: "10px",
                verticalAlign: "middle",
              }}
              size={20}
            /> */}
                    </div>
                    <div
                        className={classes.walletItemLast}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            activate(connectors.coinbaseWallet);
                            setProvider("coinbaseWallet");
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={COINBASE_LOGO}
                                alt="coinbase-logo"
                                width={48}
                                height={48}
                            />
                            <Typography variant="h6" className={classes.walletName}>
                                Coinbase Wallet
                            </Typography>
                        </div>
                    </div>
                </div>
                <Typography
                    variant="h6"
                    fontSize={sm ? "14px" : "12px"}
                    className={classes.footerText}
                >
                    Need help connecting a wallet?  <a
                        href="https://dexpay.io/faq"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            color: "#FC3F6B"
                        }}
                    >
                        Read our FAQ
                    </a>{" "}

                </Typography>
            </DialogContent>
        </Dialog>
    )
}

export default ConnectWallet