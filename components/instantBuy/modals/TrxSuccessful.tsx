"use client";
import { Modal, Box, Button, Drawer } from "@mui/material";
import React from "react";
import AppText from "../../AppText";
import { useAppSelector } from "@/store/hooks";
import { convertToCurrency } from "@/utils";
import { persistor } from "@/store/store";
import { useRouter } from "next/navigation";
import Success from "@/app/assets/images/success.gif";
import Image from "next/image";


type Props = {
    isConfirmPayment: boolean;
    onCloseConfirmPayment: () => void;
};
const TrxSuccess = ({ isConfirmPayment, onCloseConfirmPayment }: Props) => {
    const router = useRouter()
    const { expressOrderData } = useAppSelector((state) => state.tradeReducer);
    const handleTrxComplete = () => {
        persistor.purge()
        router.push('/instant-buy')
    }
    const handleClose = (event: unknown, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown")
            return;
        onCloseConfirmPayment();
    }
    return (
        <>
            <Modal
                disableEscapeKeyDown={true}
                className="hidden md:block"
                open={isConfirmPayment}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    className={
                        "bg-gray-900 p-4 w-[90%] md:w-[60%] xl:w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] "
                    }
                >
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-center">
                            <Image
                                src={Success}
                                alt="logo"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <AppText className="font-semibold text-xl" text="Transaction successful" />
                            <AppText
                                className="text-md font-medium text-center"
                                text={`${expressOrderData?.orderType === "buy"
                                    ? `You’ve successfully bought ${convertToCurrency(
                                        expressOrderData?.amountToReceive
                                    )} ${expressOrderData?.asset
                                    } which has been deposited into your wallet address.`
                                    : `You’ve successfully sold ${convertToCurrency(
                                        expressOrderData?.amount
                                    )} ${expressOrderData?.asset} for 
                  ${expressOrderData?.fiat} ${convertToCurrency(
                                        expressOrderData?.amountToReceive
                                    )} which has been paid into your account.`
                                    }`}
                            />
                        </div>
                    </div>
                    <section className="flex mt-10 gap-4 w-full">
                        <Button
                            onClick={onCloseConfirmPayment}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                        >
                            View in explorer
                        </Button>
                        <Button
                            onClick={() => handleTrxComplete}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                        >
                            {" "}
                            Done
                        </Button>
                    </section>
                </Box>
            </Modal>
            <Drawer
                anchor={'bottom'}
                open={isConfirmPayment}
                onClose={handleClose}
                className="md:hidden"

            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'}>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-center">
                            <Image
                                src={Success}
                                alt="logo"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <AppText className="font-semibold text-xl" text="Transaction successful" />
                            <AppText
                                className="text-md font-medium text-center"
                                text={`${expressOrderData?.orderType === "buy"
                                    ? `You’ve successfully bought ${convertToCurrency(
                                        expressOrderData?.amountToReceive
                                    )} ${expressOrderData?.asset
                                    } which has been deposited into your wallet address.`
                                    : `You’ve successfully sold ${convertToCurrency(
                                        expressOrderData?.amount
                                    )} ${expressOrderData?.asset} for 
                  ${expressOrderData?.fiat} ${convertToCurrency(
                                        expressOrderData?.amountToReceive
                                    )} which has been paid into your account.`
                                    }`}
                            />
                        </div>
                    </div>
                    <section className="flex mt-10 gap-4 w-full">
                        <Button
                            onClick={onCloseConfirmPayment}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                        >
                            View in explorer
                        </Button>
                        <Button
                            onClick={() => handleTrxComplete}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                        >
                            {" "}
                            Done
                        </Button>
                    </section>
                </Box>
            </Drawer>
        </>
    );
};

export default TrxSuccess;
