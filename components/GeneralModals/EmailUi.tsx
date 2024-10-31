/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import { SimpleDialogProps } from '@/store/models/modalProps'
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material"; import React from 'react'
import { EmailStyles } from './ModalStyles';
import { useAccount, useChainId, useSignMessage } from "wagmi";
import Assets from '@/utils/assets';
import { useBreakPoints, validateEmail } from '@/utils';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hooks';
import { updateEmailAddress, updateEmailOTP, updateWalletAddress } from '@/store/slices/userSlice';
import { useHandleCreateUser } from '@/services/mutations/logins';
import { SiweMessage, generateNonce } from "siwe";
import { updateSignature } from '@/store/slices/addressSlice';
import { signUpValidationSchema } from '@/utils/schema';
import TextInput from '../TextInput';
import ButtonComp from '../ButtonComp';
import { useRouter } from 'next/router';



const EmailUi = ({ onClose, open, selectedValue, setCurrentStep, }: Omit<SimpleDialogProps, 'onClickSwitch'>) => {
    const { mutateAsync: createUser, isPending } = useHandleCreateUser()
    const classes = EmailStyles();
    const [check, setCheck] = React.useState(false);
    const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(event.target.checked);
    };
    const params = useRouter();
    const { referredBy } = params.query;

    const dispatch = useAppDispatch();
    const { CANCELLED } = Assets;
    const { sm } = useBreakPoints();
    const [formData, setFormData] = React.useState({
        email: "",
        referralCode: referredBy || "",
    });
    const { email, referralCode } = formData;

    const { address } = useAccount();
    const chainId = useChainId();
    const { signMessageAsync } = useSignMessage();

    const handleClose = () => {
        onClose(selectedValue);
    };


    const signMessage = async () => {
        // Check the schema if form is valid:
        const isFormValid = await signUpValidationSchema.isValid(formData, {
            abortEarly: false, // Prevent aborting validation after first error
        });

        if (isFormValid) {
            // If form is valid, continue submission.
            // if (!library) return;
            const message = new SiweMessage({
                domain: "app.dexpay.io",
                address,
                /*       statement: "I accept the DexPay Protocol Terms of Service.", */
                uri: origin,
                nonce: generateNonce(),
                version: "1",
                chainId: chainId,
            });
            try {
                const signatureMessage = message.prepareMessage();
                const signature = await signMessageAsync({
                    message: message.prepareMessage(),
                });
                dispatch(updateSignature({ signature, signatureMessage }));
                if (signature) onHandleSubmit(signature, message.prepareMessage());
            } catch (error: any) {
                // setLoading(false);
                //console.log(error);
                toast.error(error?.message);
                return;
            }
        } else {
            signUpValidationSchema
                .validate(formData, { abortEarly: false })
                .catch((err) => {
                    // Toast all errors
                    err.inner.map((err: any) => {
                        toast.error(err.errors);
                    });
                });
        }
    };

    const onHandleSubmit = async (signature: string, signatureMessage: string) => {
        if (email == "") {
            toast.error("Email field cannot be empty", {
                id: "error",
            });
            return;
        } else if (!validateEmail(email)) {
            toast.error("Invalid Email", {
                id: "error",
            });
            return;
        }

        try {
            const req = await createUser({
                publicAddress: address,
                signature: signature,
                message: signatureMessage,
                emailAddress: email,
                referredBy: referralCode,
            })
            const res = req.data;
            dispatch(updateEmailAddress(res.emailAddress));
            dispatch(updateWalletAddress(res.publicAddress));
            dispatch(updateEmailOTP(res.emailOtp));
            if (res) setCurrentStep("3");
        } catch (error: any) {
            console.log(error);
            // toast.error(error.response.data.message);
        }
    };

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    return (
        <Dialog
            className={classes.dialog}
            /* onClose={() => handleDisconnect()} */
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
                        Register
                    </Typography>
                    <Image
                        src={CANCELLED}
                        alt="cancelled"
                        width={18}
                        height={18}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            handleClose();
                        }}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={classes.walletDiv}>
                    <FormControl fullWidth>
                        <Typography variant="h6" className={classes.label}>
                            Email Address
                        </Typography>
                        <TextInput
                            name="email"
                            value={email}
                            placeholder="Input your email address"
                            onChange={(e: any) => handleChange(e)}
                            inputType="email"
                            errorText={email && !validateEmail(email) && `Invalid Email`}
                        />
                    </FormControl>
                    <br />
                    <Typography variant="body1" className={classes.footerText}>
                        A verification code would be sent to your email address
                    </Typography>
                    <br />
                    <FormControl fullWidth>
                        <Typography variant="h6" className={classes.label}>
                            Referral code (optional)
                        </Typography>
                        <TextInput
                            name="referralCode"
                            value={referralCode}
                            placeholder="Referral code"
                            onChange={(e: any) => handleChange(e)}
                            inputType="text"
                        /*  errorText={email && !validateEmail(email) && `Invalid Email`} */
                        />
                    </FormControl>
                    <br />
                    <br />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={check}
                                    onChange={handleChangeCheck}
                                    sx={{
                                        color: "white",
                                        "&.Mui-checked": {
                                            color: "#fff",
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography className={classes.labelStyle}>
                                    I agree to the{" "}
                                    <a
                                        href="/Terms_of_Service_DexPay.pdf"
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            color: "#F92556",
                                        }}
                                    >
                                        Terms of Service
                                    </a>
                                </Typography>
                            }
                        />
                    </FormGroup>
                    <div className={classes.btnDiv}>
                        <ButtonComp
                            handleSubmit={() => signMessage()}
                            fullWidth={true}
                            disabled={!check}
                            loading={isPending}
                            margin="10px 0 0 0"
                        >
                            Proceed
                        </ButtonComp>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EmailUi