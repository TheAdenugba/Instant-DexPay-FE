/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Modal, Box, Button, Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppText from "../../AppText";
import SpinnerIcon from "@/app/assets/icons/spinnerIcon";
import { useAppSelector } from "@/store/hooks";
import useDisclosure from "@/utils/useDisclosure";
import Chat from "@/components/chat/Chat";
import { useRouter, useSearchParams } from "next/navigation";
import { getUsernameToDisplay } from "@/utils";
import moment from "moment";
import { useCancelTrade, useConfirmReceivedSoldPayment, useGetOrderById } from "@/services/mutations/chat.mutation";
import toast from "react-hot-toast";
import TrxSuccess from "./TrxSuccessful";
import ConfirmTimer from "@/components/ConfirmTimer";
import CancelModal from "./CancelModal";
import useMessageSignature from "@/hooks/useSignatureMessage";
import { useAccount, useChainId } from "wagmi";
import { persistor } from "@/store/store";
import DisputeModal from "./DisputeModal";
import ConfirmPaymentReceived from "./ConfirmPaymentReceived";

type Props = {
    isConfirmPayment: boolean;
    onCloseConfirmPayment: () => void;
    onOpenConfirmPayment: () => void;
};

const ConfirmPayment = ({
    isConfirmPayment,
    onCloseConfirmPayment,
    onOpenConfirmPayment,
}: Props) => {
    const router = useRouter();
    const chainId = useChainId();
    const { address } = useAccount();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [initCount, setInitCount] = useState(0);
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { data: tradeOrder } = useGetOrderById(orderId as string);
    const { user, socket } = useAppSelector((state) => state.userReducer);
    const { expressOrderData } = useAppSelector((state) => state.tradeReducer);
    const { requestSelf, getVerifiedSignature } = useMessageSignature();
    const {
        isOpen: isConfirmPaymentReceived,
        onClose: onConfirmPaymentReceivedClose,
        onOpen: onConfirmPaymentReceivedOpen
    } = useDisclosure();
    const {
        isOpen: isCancel,
        onClose: onCancelClose,
        onOpen: onCancelOpen,
    } = useDisclosure();
    const {
        isOpen: isDisputeOpen,
        onClose: onDisputeClose,
        onOpen: onDisputeOpen,
    } = useDisclosure();
    const {
        isOpen: isSellerReleasedOpen,
        onClose: onSellerReleasedClose,
        onOpen: onSellerReleasedOpen,
    } = useDisclosure();

    const { mutateAsync: cancelTrade, isPending: cancelLoading } = useCancelTrade(
        orderId as string
    );

    const { mutateAsync: confirmPaymentReceived, isPending: paymentReceivedLoading } = useConfirmReceivedSoldPayment(orderId as string);

    const handleData = () => {
        const end = moment(new Date()); //current time
        const start = moment(tradeOrder?.data?.createdAt); // order created time
        const duration = moment.duration(end.diff(start));
        const timeAfterOrder = duration.asSeconds();
        const confirmationDurationInSeconds = tradeOrder?.data?.tradeAd?.paymentTime * 60;
        if (timeAfterOrder > confirmationDurationInSeconds) {
            // payment time exceeded proceed to terminate order or perform next action
            setInitCount(0);
            /* console.log("Minutes>>>>>>>>> " + timeAfterOrder ); */
        } else {
            setInitCount(confirmationDurationInSeconds - timeAfterOrder);
        }
    };

    useEffect(() => {
        if (tradeOrder?.data) handleData();
    }, [tradeOrder?.data]);

    useEffect(() => {
        if (socket) {
            socket.on("Token released", (data: any) => {
                if (data.payload._id === orderId) {
                    onSellerReleasedOpen();
                    toast.success(
                        `${getUsernameToDisplay(
                            user?.username,
                            data?.payload?.sellerAddress?.user?.username,
                            data?.payload?.buyerAddress?.user?.username
                        )} has released asset, trade completed`,
                        {
                            id: "seller released",
                        }
                    );
                    //console.log("see data>>>" + JSON.stringify(data?.payload));
                    // if (Router.pathname == "/buy/waiting" || Router.pathname == "/chat") {
                    //     Router.push(
                    //         `/success?orderId=${orderId}&orderType=Buy&txId=${data?.payload?.releaseTxId}`
                    //     );
                    // }
                }
            });
            socket.once(
                "Payment made",
                (data: { payload: { _id: string | string[] | undefined } }) => {
                    if (data.payload._id == orderId) {
                        toast.success(
                            "Buyer has paid, kindly check if you've received the funds",
                            {
                                id: "buyer has paid",
                            }
                        );
                    }
                }
            );

        }
    }, [socket]);

    const handleClose = (event: any, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown") return;
        onCloseConfirmPayment();
    };

    const handleCancel = async () => {
        try {
            onCancelOpen();
            onCancelClose()
            const merchantAddress =
                tradeOrder?.data?.sellerAddress._id === address
                    ? tradeOrder?.data?.buyerAddress._id
                    : tradeOrder?.data?.sellerAddress._id;
            const validUntil = Math.floor(Date.now() / 1000 + 3600);
            const signatureMessage = {
                message: await requestSelf(address as any, validUntil, merchantAddress),
                signature: await getVerifiedSignature(
                    address as any,
                    chainId,
                    validUntil,
                    merchantAddress
                ),
            };
            const response = await cancelTrade({ data: signatureMessage });
            if (response) {
                toast.success("Order cancelled successfully");
                router.push("/instant-buy");
                persistor.purge();
            }
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error",
            });
        }
    };

    const handleConfirmSellPayment = async () => {
        // onSellerReleasedOpen()
        // onConfirmPaymentReceivedClose()
        try {
            const merchantAddress =
                tradeOrder?.data?.sellerAddress._id === address
                    ? tradeOrder?.data?.buyerAddress._id
                    : tradeOrder?.data?.sellerAddress._id;
            const validUntil = Math.floor(Date.now() / 1000 + 3600);
            const signatureMessage = {
                message: await requestSelf(address as any, validUntil, merchantAddress),
                signature: await getVerifiedSignature(
                    address as any,
                    chainId,
                    validUntil,
                    merchantAddress
                ),
            };
            const response = await confirmPaymentReceived({ data: signatureMessage });
            if (response) {
                toast.success("Successfully confirmed payment", {
                    id: "Successfully Confirmed",
                });
            }
            onSellerReleasedOpen()
            onConfirmPaymentReceivedClose()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });

        }
    }


    return (
        <>
            <Modal
                className="hidden md:block"
                disableEscapeKeyDown={true}
                onClose={handleClose}
                open={isConfirmPayment}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
                            backdropFilter: "blur(3px)",
                        },
                    },
                }}
            >
                <Box
                    className={
                        "bg-gray-900 px-5 py-8 w-[90%] md:w-[60%] xl:w-[28%] rounded-xl absolute translate-x-[-50%] top-[40%] left-2/4 translate-y-[-50%] "
                    }
                >
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end mb-6">
                            <Button
                                onClick={onOpen}
                                variant="outlined"
                                fullWidth={false}
                                size="large"
                                className="bg-gray-700 outline-gray-700 w-2/4 lg:w-1/3 rounded-lg text-white text-md font-medium capitalize"
                            >
                                Contact {`${expressOrderData?.orderType === "buy" ? "Seller" : "Buyer"}`}
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <SpinnerIcon />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <AppText
                                className="font-semibold text-xl"
                                text={` ${expressOrderData?.orderType === "buy" ? "Confirming" : "Processing"
                                    } Payment`}
                            />
                            <AppText
                                className="text-lg font-medium text-center"
                                text={`Please hold on your payment is being ${expressOrderData?.orderType === "buy" ? "confirmed" : "processed"
                                    }`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 mt-6">
                            <AppText className="text-gray-400 text-sm font-medium" text="Time left" />
                            {/* <AppText className="font-semibold text-3xl" text="00:05" /> */}
                            <ConfirmTimer initCount={Number(initCount)} />
                        </div>
                    </div>
                    <section className="flex mt-10 flex-col-reverse sm:flex-row gap-4 w-full">
                        {expressOrderData?.orderType === "buy" ? (
                            <>
                                <Button
                                    onClick={() => {
                                        onCloseConfirmPayment();
                                        onCancelOpen();
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize w-full"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        onCloseConfirmPayment();
                                        onDisputeOpen();
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-white rounded-lg text-[#0A0F19] capitalize text-md font-medium"
                                >
                                    {" "}
                                    Contact support
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        onCancelOpen();
                                        onCloseConfirmPayment();
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize w-full"
                                >
                                    Contact support
                                </Button>
                                <Button
                                    onClick={() => {
                                        onConfirmPaymentReceivedOpen()
                                        onCloseConfirmPayment()
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-white rounded-lg text-[#0A0F19] capitalize text-md font-medium"
                                >
                                    Confirm Payment
                                </Button>
                            </>
                        )}
                    </section>
                </Box>
            </Modal>
            <Drawer
                anchor={'bottom'}
                onClose={handleClose}
                open={isConfirmPayment}
                className="md:hidden"
            >
                <Box className={'bg-gray-900 p-7 w-full rounded-t-sm'}>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-end mb-6">
                            <Button
                                onClick={onOpen}
                                variant="outlined"
                                fullWidth={false}
                                size="large"
                                className="bg-gray-700 outline-gray-700 w-2/4 lg:w-1/3 rounded-xl text-white text-md font-medium capitalize"
                            >
                                Contact {`${expressOrderData?.orderType === "buy" ? "Seller" : "Buyer"}`}
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <SpinnerIcon />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <AppText
                                className="font-semibold text-xl"
                                text={` ${expressOrderData?.orderType === "buy" ? "Confirming" : "Processing"
                                    } Payment`}
                            />
                            <AppText
                                className="text-lg font-medium text-center"
                                text={`Please hold on your payment is being ${expressOrderData?.orderType === "buy" ? "confirmed" : "processed"
                                    }`}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 mt-6">
                            <AppText className="text-gray-400 text-sm font-medium" text="Time left" />
                            {/* <AppText className="font-semibold text-3xl" text="00:05" /> */}
                            <ConfirmTimer initCount={Number(initCount)} />
                        </div>
                    </div>
                    <section className="flex mt-10 gap-4 w-full">
                        {expressOrderData?.orderType === "buy" ? (
                            <>
                                <Button
                                    onClick={() => {
                                        onCloseConfirmPayment();
                                        onCancelOpen();
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize w-full"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        onCloseConfirmPayment();
                                        onDisputeOpen();
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-white rounded-lg text-[#0A0F19] capitalize text-md font-medium"
                                >
                                    {" "}
                                    Contact support
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => {
                                        onCancelOpen();
                                        onCloseConfirmPayment();
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize w-full"
                                >
                                    Contact support
                                </Button>
                                <Button
                                    onClick={() => {
                                        onConfirmPaymentReceivedOpen()
                                        onCloseConfirmPayment()
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    className="bg-white rounded-lg text-[#0A0F19] capitalize text-md font-medium"
                                >
                                    Confirm Payment
                                </Button>
                            </>
                        )}
                    </section>
                </Box>
            </Drawer>

            <CancelModal
                cancelLoading={cancelLoading}
                handleCancel={handleCancel}
                isCancel={isCancel}
                onClose={onCancelClose}
                repaymentModalOpen={onOpenConfirmPayment}
            />

            <DisputeModal
                onOpenConfirmPayment={onOpenConfirmPayment}
                isDisputeOpen={isDisputeOpen}
                onDisputeClose={onDisputeClose}
                onDisputeOpen={onDisputeOpen}
            />
            <TrxSuccess
                isConfirmPayment={isSellerReleasedOpen}
                onCloseConfirmPayment={onSellerReleasedClose}
            />
            <Chat
                onOpenConfirmPayment={onOpenConfirmPayment}
                onSellerReleasedOpen={onSellerReleasedOpen}
                isOpen={isOpen}
                onClose={onClose}
                id={orderId as string}
            />
            <ConfirmPaymentReceived
                isConfirmPaymentReceived={isConfirmPaymentReceived}
                onConfirmClose={onConfirmPaymentReceivedClose}
                onOpenConfirmPayment={onOpenConfirmPayment}
                handleConfirmSellPayment={handleConfirmSellPayment}
                isConfirming={paymentReceivedLoading}
            />
        </>
    );
};

export default ConfirmPayment;
