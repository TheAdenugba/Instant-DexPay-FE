/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import toast from 'react-hot-toast';
import { useAccount, useChainId } from 'wagmi';
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Modal, Box, Button, Typography, Drawer } from '@mui/material'
import AppText from '../AppText'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { convertToCurrency, getCurrencySymbol, getMinute, getSeconds } from '@/utils'
import { useCancelTrade, useConfirmPayment, useGetOrderById } from '@/services/mutations/chat.mutation'
import useMessageSignature from '@/hooks/useSignatureMessage';
import { persistor } from "@/store/store";
import { updateTimeUp } from "@/store/slices/traderSlice";
import CancelModal from "./modals/CancelModal";
import useDisclosure from "@/utils/useDisclosure";
import Chat from "../chat/Chat";
import InitialConfirmPayment from "./modals/InitialConfirmPayment";
import { Copy } from "iconsax-react";

type Props = {
    isOpen: boolean
    onClose: () => void
    onOpenConfirmPayment: () => void
    onOpen: () => void
}
const MakeRepayment = ({ isOpen, onClose, onOpenConfirmPayment, onOpen }: Props) => {
    const { isOpen: isOpenChat, onClose: onCloseChat, onOpen: onOpenChat } = useDisclosure();
    const router = useRouter()
    const chainId = useChainId();
    const { address } = useAccount();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [initCount, setInitCount] = useState<number>(0);
    const [timeElapse, setTimeElapse] = useState(false);
    const [counter, setCounter] = useState<number>(0);
    // const { timeUp } = useAppSelector((state) => state.tradeReducer);
    // const [timerIsUp, setTimeUp] = useState(timeUp);
    const { requestSelf, getVerifiedSignature } = useMessageSignature();
    const { expressOrderData } = useAppSelector(
        (state) => state.tradeReducer
    );
    const { isOpen: isCancel, onClose: onCancelClose, onOpen: onCancelOpen } = useDisclosure();
    const { isOpen: isCancelConfirmed, onClose: onConfirmClose, onOpen: onConfirmOpen } = useDisclosure();


    const { data: tradeOrder } = useGetOrderById(orderId as string)
    const { mutateAsync: confirmPayment, isPending: isConfirming } = useConfirmPayment(orderId as string)
    const { mutateAsync: cancelTrade, isPending: cancelLoading } = useCancelTrade(orderId as string)

    const handleData = () => {
        const end = moment(new Date()); //current time
        const start = moment(tradeOrder?.data?.createdAt); // order created time
        const duration = moment.duration(end.diff(start));
        const timeAfterOrder = duration.asSeconds();
        const confirmationDurationInSeconds =
            tradeOrder?.data?.tradeAd?.paymentTime * 60;
        if (timeAfterOrder > confirmationDurationInSeconds) {
            const AdditionalTime = confirmationDurationInSeconds + 1800;
            if (timeAfterOrder > AdditionalTime) {
                setInitCount(0);
            } else {
                setInitCount(AdditionalTime - timeAfterOrder);
            }
            // payment time exceeded proceed to terminate order or perform next action
            /* console.log("Minutes>>>>>>>>> " + timeAfterOrder ); */
        } else {
            setInitCount(confirmationDurationInSeconds - timeAfterOrder);
        }
    }
    useEffect(() => {
        if (tradeOrder?.data) {
            handleData()
            dispatch(updateTimeUp(false))
        }
    }, [tradeOrder?.data])


    const handleClose = (event: any, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown")
            return;
        onClose();
    }
    const handleTransferred = async () => {
        // onOpenConfirmPayment()
        // onClose()
        // onConfirmClose()
        try {
            const merchantAddress =
                tradeOrder?.data?.sellerAddress?._id === address
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
            const response = await confirmPayment({ data: signatureMessage })

            if (response) {
                toast.success("Please wait for seller to confirm payment", {
                    id: "please wait",
                });
                onConfirmClose()
                onClose()
                onOpenConfirmPayment()
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message, {
                id: "error",
            });
        }
    };

    const handleCancel = async () => {
        try {
            onCancelOpen()
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
            const response = await cancelTrade({ data: signatureMessage })
            if (response) {
                toast.success("Order cancelled successfully");
                router.push("/instant-buy");
                persistor.purge()
            }
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error",
            });
        }
    };

    useEffect(() => {
        if (initCount > 0) {
            // Start the timer
            const timer = setInterval(() => {
                setInitCount((prev) => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(timer); // Cleanup
        } else if (initCount <= 0 && counter <= 0 && !timeElapse) {
            // Handle transitions when timer reaches 0
            const additionalTimeInSeconds = (tradeOrder?.data?.paymentDurationInMins || 0) * 60;
            setCounter(additionalTimeInSeconds)
        } else if (counter > 0) {
            const timer = setInterval(() => {
                setCounter((prev) => {
                    const max = Math.max(0, prev - 1)
                    if (max <= 0) setTimeElapse(true)
                    return max
                });
            }, 1000);
            return () => clearInterval(timer); // Cleanup
        }
    }, [initCount, counter, tradeOrder?.data?.paymentDurationInMins, dispatch]);

    const copyToClipBoard = async (text: any) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied Successfully!", {
                id: "success",
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Failed to copy!", {
                id: "error",
            });
        }
    };
    return (
        <>
            <Modal
                className="hidden md:block"
                disableEscapeKeyDown={true}
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                slotProps={{
                    backdrop: {
                        sx: {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',  // Semi-transparent background
                            backdropFilter: 'blur(3px)',
                        },
                    },
                }}
            >
                <Box className={'bg-gray-900 p-7 w-[90%] md:w-[60%] xl:w-[28%]  rounded-xl absolute translate-x-[-50%] top-[40%] left-2/4 translate-y-[-50%] '} >
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between">
                            <AppText className='font-semibold text-xl' text='Make Payment' />
                            <Typography
                                textAlign="right"
                                fontWeight="500"
                                color="#FC3F6B"
                                fontSize="16px"
                            >
                                {initCount > 0 ? (
                                    `${getMinute(initCount)}:${getSeconds(initCount)}`
                                ) : counter > 0 ? (
                                    // "Switching to extended time..."
                                    `${getMinute(counter)}:${getSeconds(counter)}`
                                ) : (
                                    "Time has elapsed"
                                )}

                            </Typography>
                        </div>
                        <div className='flex flex-col items-center justify-center space-y-3'>
                            <AppText className="font-semibold text-xl md:text-3xl" text={`${expressOrderData?.fiat} ${convertToCurrency(expressOrderData?.amount)}`} />
                            <AppText className="text-gray-400 text-md md:text-lg font-semibold" text={`${convertToCurrency(expressOrderData?.amountToReceive)} ${expressOrderData?.asset}`} />
                        </div>
                        <div className='mt-6'>
                            <AppText className="font-semibold text-lg md:text-xl" text='Bank Transfer' />
                        </div>

                        <div className='flex flex-col space-y-4 font-semibold'>
                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Bank' />
                                <AppText text={tradeOrder?.data?.paymentAccount?.bankName} />
                            </div>

                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Account Number' />
                                <div className="flex gap-x-1">
                                    <AppText text={tradeOrder?.data?.paymentAccount?.accountNumber} />
                                    <Copy size="15" color="#fff" onClick={() =>
                                        copyToClipBoard(tradeOrder?.data?.paymentAccount?.accountNumber)
                                    } />
                                </div>
                            </div>

                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Account Name' />
                                <AppText text={tradeOrder?.data?.paymentAccount?.accountName} />
                            </div>

                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Rate' />
                                <AppText text={`1.00 ${expressOrderData?.asset} = ${getCurrencySymbol(expressOrderData?.fiat)}${convertToCurrency(expressOrderData?.price)} `} />
                            </div>
                        </div>
                    </div>
                    <section className="flex flex-col-reverse sm:flex-row gap-4 mt-12 w-full">
                        <Button
                            onClick={() => {
                                onCancelOpen()
                                onClose()
                            }}
                            variant="outlined"
                            fullWidth
                            size='medium'
                            className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirmOpen}
                            variant="outlined"
                            fullWidth
                            size='medium'
                            className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                        >
                            I have made this payment
                        </Button>
                    </section>
                </Box>
            </Modal>
            <Drawer
                anchor={'bottom'}
                open={isOpen}
                onClose={handleClose}
                className="md:hidden"

            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'}>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <AppText className='font-semibold text-lg' text='Make Payment' />
                                <div className="flex gap-x-2 items-center mt-2">
                                    <span className="text-gray-400 text-sm">Cancels in:</span>
                                    <Typography
                                        textAlign="left"
                                        fontWeight="500"
                                        color="#FC3F6B"
                                        fontSize="12px"
                                    >
                                        {initCount > 0 ? (
                                            `${getMinute(initCount)}:${getSeconds(initCount)}`
                                        ) : counter > 0 ? (
                                            // "Switching to extended time..."
                                            `${getMinute(counter)}:${getSeconds(counter)}`
                                        ) : (
                                            "Time has elapsed"
                                        )}

                                    </Typography>
                                </div>
                            </div>
                            <Button
                                onClick={onOpenChat}
                                variant="outlined"
                                fullWidth={false}
                                size="medium"
                                className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize"
                            >
                                Contact {`${expressOrderData?.orderType === "buy" ? "Seller" : "Buyer"}`}
                            </Button>
                        </div>
                        <div className='flex flex-col items-center justify-center space-y-3'>
                            <AppText className="font-semibold text-xl md:text-3xl" text={`${expressOrderData?.fiat} ${convertToCurrency(expressOrderData?.amount)}`} />
                            <AppText className="text-gray-400 text-md md:text-lg font-semibold" text={`${convertToCurrency(expressOrderData?.amountToReceive)} ${expressOrderData?.asset}`} />
                        </div>
                        <div className='mt-6'>
                            <AppText className="font-semibold text-lg md:text-xl" text='Bank Transfer' />
                        </div>

                        <div className='flex flex-col space-y-4 font-semibold'>
                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Bank' />
                                <AppText text={tradeOrder?.data?.paymentAccount?.bankName} />
                            </div>

                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Account Number' />
                                <AppText text={tradeOrder?.data?.paymentAccount?.accountNumber} />
                            </div>

                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Account Name' />
                                <AppText text={tradeOrder?.data?.paymentAccount?.accountName} />
                            </div>

                            <div className='flex justify-between'>
                                <AppText className="text-gray-400" text='Rate' />
                                <AppText text={`1.00 ${expressOrderData?.asset} = ${getCurrencySymbol(expressOrderData?.fiat)}${convertToCurrency(expressOrderData?.price)} `} />
                            </div>
                        </div>
                    </div>
                    <section className="flex sm:flex-row gap-x-2 mt-12 w-full">
                        <Button
                            onClick={() => {
                                onCancelOpen()
                                onClose()
                            }}
                            variant="outlined"
                            fullWidth
                            size='large'
                            className="bg-gray-700 w-3/4 p-4 outline-gray-700 rounded-lg text-white text-xs font-medium capitalize"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirmOpen}
                            variant="outlined"
                            fullWidth
                            size='large'
                            className="bg-white rounded-lg p-4 w-full text-[#0A0F19] capitalize text-xs font-medium space-x-1"
                        >
                            I have made this payment
                        </Button>
                    </section>
                </Box>
            </Drawer>
            <CancelModal
                cancelLoading={cancelLoading}
                handleCancel={handleCancel}
                isCancel={isCancel}
                onClose={onCancelClose}
                repaymentModalOpen={onOpen} />
            <Chat
                makeRepaymentOpen={onOpen}
                isOpen={isOpenChat}
                onClose={onCloseChat}
                id={orderId as string}
            />
            <InitialConfirmPayment
                isCancelConfirmed={isCancelConfirmed}
                onConfirmClose={onConfirmClose}
                onOpenMakeRepayment={onOpen}
                handleTransferred={handleTransferred}
                isConfirming={isConfirming}
            />

        </>
    )
}

export default MakeRepayment