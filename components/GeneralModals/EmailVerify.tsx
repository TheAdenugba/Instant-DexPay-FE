/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleDialogProps } from '@/store/models/modalProps'
import Image from 'next/image';
import React from 'react'
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    TextField,
    Box,
    Button,
} from "@mui/material";
import { useAuthenticateAddress, useRequestOtp, useVerifyEmail } from '@/services/mutations/logins';
import { useChainId, useDisconnect, useSignMessage } from 'wagmi';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetAddressState, updateSignature } from '@/store/slices/addressSlice';
import { resetUserState, updateIsAuth, updateUser, updateWalletStatus } from '@/store/slices/userSlice';
import { EmailVerifyStyles } from './ModalStyles';
import ButtonComp from '../ButtonComp';
import Assets from '@/utils/assets';
import { setAuthToken, useBreakPoints } from '@/utils';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { resetTradeState } from '@/store/slices/traderSlice';
import { isSolanaWallet } from '@dynamic-labs/solana';
import { isEthereumWallet } from '@dynamic-labs/ethereum';
import { SiweMessage } from 'siwe';

const EmailVerify = ({ onClose, open, selectedValue, }: Omit<SimpleDialogProps, 'onClickSwitch'>) => {
    const { CANCELLED } = Assets;
    const { sm, } = useBreakPoints();
    const { emailOtp } = useAppSelector((state) => state.userReducer);
    const [otp, setOtp] = React.useState(emailOtp);
    const { hashedEmail } = useAppSelector(
        (state) => state.addressReducer
    );
    const { mutateAsync: handleOTP } = useRequestOtp()
    const { mutateAsync: handleAuthenticate } = useAuthenticateAddress()
    const { mutateAsync: handleVerifyOtp, isPending: otpPending } = useVerifyEmail()
    const { nonce } = useAppSelector((state) => state.userReducer);

    const dispatch = useAppDispatch();
    const { disconnect } = useDisconnect();
    const [counter, setCounter] = React.useState(60);
    const classes = EmailVerifyStyles()
    const { primaryWallet, handleLogOut } = useDynamicContext();
    const { signMessageAsync } = useSignMessage();
    const chainId = useChainId();



    const handleClose = () => {
        onClose(selectedValue);
    };
    const handleChange = (e: any) => {
        setOtp(e.target.value);
    };

    const handleDisconnect = () => {
        window.localStorage.removeItem("provider");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        window.localStorage.removeItem("defaultAsset");
        dispatch(resetUserState());
        dispatch(resetAddressState());
        dispatch(resetTradeState());
        dispatch(updateIsAuth(false));
        handleLogOut();
        handleClose();
        disconnect();
        toast.success("Wallet Disconnected", {
            id: "disconnected",
        });
        location.reload()
    };

    const handleResend = async () => {
        if (counter > 0) return;
        try {
            await handleOTP(primaryWallet?.address)

            toast.success("Verification code resent to your email address", {
                id: "verification"
            });
            setCounter(60);
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error"
            });
        }
    };

    const authenticateAddress = async (signature: string, message: string) => {
        try {
            const response = await handleAuthenticate({
                publicAddress: primaryWallet?.address,
                signature: signature,
                message: message,
            })

            const res = response.data;

            if (res.auth) {
                localStorage.setItem("token", res.auth.accessToken);
                localStorage.setItem("refreshToken", res.auth.refreshToken);
                dispatch(updateIsAuth(true));
                dispatch(updateWalletStatus(res.status));
                dispatch(updateUser(res.user));
                setAuthToken(res.auth.accessToken);
                handleClose();
                toast.success("Email verified", {
                    id: "verified"
                });
                // setLoading(false);
                // Router.push('/overview');
            }
        } catch (error: any) {
            dispatch(updateIsAuth(false))
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });
            //setCurrentStep("6");
        }
    };

    const onHandleSubmit = async () => {
        if (otp === "") {
            toast.error("OTP field cannot be empty", {
                id: "error"
            });
            return;
        } else if (otp.length < 6 || otp.length > 6) {
            toast.error("OTP should be 6 digit", {
                id: "error"
            });
            return;
        }
        try {
            const response = await handleVerifyOtp({
                otp: Number(otp),
                publicAddress: primaryWallet?.address,
            })
            if (response) {
                if (!primaryWallet) return;
                // if it's solana Wallet generate solana signature
                if (isSolanaWallet(primaryWallet)) {
                    const signature = await primaryWallet.signMessage(nonce);
                    //console.log("see signature>>>>>>>>>> " + signature);
                    if (signature) {
                        dispatch(updateSignature({ signature, signatureMessage: nonce }));
                        authenticateAddress(signature, nonce);
                    }
                } // else if it's EVM wallet generate evm signature
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
            }
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error"
            });
        }
    };

    React.useEffect(() => {
        if (counter > 0) {
            const timer = setInterval(() => setCounter(counter - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [counter]);
    return (
        <Dialog
            className={classes.dialog}
            onClose={() => handleDisconnect()}
            open={open}
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
                        Verify Email
                    </Typography>
                    <Image
                        src={CANCELLED}
                        alt="cancelled"
                        width={18}
                        height={18}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            handleDisconnect();
                        }}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={classes.walletDiv}>
                    <FormControl fullWidth>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography variant="h6" className={classes.label}>
                                Verification Code {hashedEmail && `( ${hashedEmail} )`}
                            </Typography>
                            <Typography variant="body2" className={classes.timer}>
                                {counter > 0 && counter}
                            </Typography>
                        </Box>
                        <TextField
                            placeholder="Input your otp code"
                            className={classes.filterOrder}
                            value={otp}
                            type="number"
                            name="otp"
                            onChange={(e) => handleChange(e)}
                            onInput={(e: any) => {
                                e.target.value = Math.max(0, parseInt(e.target.value))
                                    .toString()
                                    .slice(0, 6);
                            }}
                            InputLabelProps={{
                                style: { color: "white" },
                            }}
                            sx={{
                                marginTop: "12px",
                                ".css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
                                    color: "white",
                                },
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "32px",
                                    backdropFilter: "blur(6px)",
                                    background: "#16171D",
                                },
                                ".css-1x5jdmq": {
                                    color: "white",
                                },
                            }}
                            InputProps={{
                                classes: { input: classes.input },
                                sx: {
                                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                                        border: "1px solid #1E2029",
                                    },
                                    "&:hover": {
                                        ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                                            border: "1px solid #1E2029",
                                        },
                                    },
                                },
                            }}
                        />
                    </FormControl>
                    <br />
                    <Typography variant="body1" className={classes.verText}>
                        Enter the 6-digit code sent to your email address
                    </Typography>
                    <div className={classes.btnDiv}>
                        <ButtonComp
                            handleSubmit={() => onHandleSubmit()}
                            fullWidth={true}
                            loading={otpPending}
                            margin="48px 0 0 0"
                        >
                            Proceed
                        </ButtonComp>
                    </div>
                    <div className={classes.btnDiv}>
                        <Button
                            onClick={() => handleResend()}
                            disabled={counter > 0 ? true : false}
                            sx={{
                                marginTop: "15px",
                                opacity: counter > 0 ? 0.2 : 1,
                                color: "#fff !important",
                                backgroundColor: "#1E2029",
                                borderRadius: "64px",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                fontStyle: "normal",
                                lineHeight: "17px",
                                display: "block",
                                padding: "16px 18px 16px 18px",
                                width: "100%",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "#2E3141",
                                    color: "#fff",
                                },
                            }}
                        >
                            Resend
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EmailVerify