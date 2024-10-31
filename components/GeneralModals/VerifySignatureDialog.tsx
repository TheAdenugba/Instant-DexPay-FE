/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React from 'react'
import { useStyles } from './ModalStyles';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Button,
} from "@mui/material";
import Assets from "@/utils/assets";
import { useChainId, useDisconnect, useSignMessage } from "wagmi";
import { resetUserState, updateIsAuth, updateUser, updateWalletStatus } from "@/store/slices/userSlice";
import { resetAddressState, updateSignature } from "@/store/slices/addressSlice";
import toast from "react-hot-toast";
import { SimpleDialogProps } from "@/store/models/modalProps";
import { useAuthenticateAddress, useRequestOtp } from "@/services/mutations/logins";
import { setAuthToken, useBreakPoints } from "@/utils";
import { SiweMessage } from "siwe";
import { isSolanaWallet } from "@dynamic-labs/solana";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { RootState } from "@/store/store";
import { resetTradeState } from "@/store/slices/traderSlice";



const VerifySignatureDialog = ({ emailVerified, onClose, open, selectedValue, setCurrentStep, }: Omit<SimpleDialogProps, 'onClickSwitch'>) => {
  const { sm } = useBreakPoints();
  const { signMessageAsync } = useSignMessage();
  const chainId = useChainId();
  const { CANCELLED, APPROVE } = Assets;
  const { disconnect } = useDisconnect();
  const { mutateAsync: handleAuthenticate, isPending } = useAuthenticateAddress()
  const { mutateAsync: handleOTP } = useRequestOtp()
  const dispatch = useAppDispatch();
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const { nonce } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const classes = useStyles();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleDisconnect = () => {
    disconnect();
    window.localStorage.removeItem("provider");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("defaultAsset");
    dispatch(resetUserState());
    dispatch(resetAddressState());
    dispatch(resetTradeState());
    dispatch(updateIsAuth(false));
    handleClose();
    handleLogOut();
    toast.success("Wallet Disconnected", {
      id: "disconnected",
    });
    location.reload()
  };

  const authenticateAddress = async (
    signature: string,
    signatureMessage: string
  ) => {
    try {
      const response = await handleAuthenticate({
        publicAddress: primaryWallet?.address,
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
        handleClose()
        toast.success("Authentication Successful")
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
      await handleOTP(address)
      setCurrentStep("3");

    } catch (error: any) {
      toast.error(error.message, {
        id: "error",
      });
    }
  }
  const signMessage = async () => {
    try {
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
        OTPHandler(primaryWallet?.address)
      }
    } catch (error: any) {
      toast.error(error.message, {
        id: "error",
      });
    }

  }

  const handleVerify = () => {
    signMessage();
  };

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
            Verify
          </Typography>
          <Image
            width={18}
            height={18}
            src={CANCELLED}
            alt="cancelled"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDisconnect();
            }}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <div className={classes.walletDiv}>
          <div className={classes.warningDiv}>
            <Image
              src={APPROVE}
              className={classes.warningIcon}
              alt="warning"
              width={48}
              height={48}
            />
            <Typography className={classes.warningHeaderText}>
              Verify your account
            </Typography>
            <Typography variant="body2" className={classes.warningBodyText}>
              To finish connecting, you must sign a message in your wallet to
              verify that you are the owner of this account.
            </Typography>
            {/* <Typography className={classes.timeValue}>32:21</Typography> */}
          </div>
          <div className={classes.btnDiv}>
            <Button
              onClick={() => handleVerify()}
              disabled={isPending}
              sx={{
                marginTop: "48px",
                color: "#111217",
                backgroundColor: "#FFFFFF",
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
                  backgroundColor: "#FC3F6B",
                  color: "#fff",
                },
              }}
            >
              {isPending ? "Signing" : "Sign message"}
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
          </div>
        </div>
        <Typography variant="h6" className={classes.footerText}>
          What is a signature?{" "}
          <a
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

export default VerifySignatureDialog