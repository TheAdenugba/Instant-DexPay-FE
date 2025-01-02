/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Box, Button, CircularProgress, Drawer, FormControl, Modal, TextareaAutosize, Typography } from '@mui/material'
import AppTextInput from '@/components/AppTextInput';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCreateTradeDispute } from '@/services/mutations/chat.mutation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    // onOpen?: () => void;
    onDisputeOpen: () => void
}
const ConfirmDispute = ({ onClose, onDisputeOpen, isOpen }: Props) => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [comment, setComment] = useState('');

    const { isPending, mutateAsync } = useCreateTradeDispute(orderId as string)
    const handleClose = (event: unknown, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown")
            return;
        onClose(); //close confirm dispute creation modal
        onDisputeOpen()
    }
    const handleValChange = (event: string) => {
        setComment(event);
    };

    const handleCreateDispute = async () => {
        try {
            if (comment == "") {
                toast.error("Reason field cannot be blank", {
                    id: "error",
                });
                return;
            }
            const response = await mutateAsync({ reason: comment })
            setComment('')
            if (response)
                toast.success("Dispute created", {
                    id: "dispute created",
                });
            onClose(); //close confirm dispute creation modal
            onDisputeOpen()
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error",
            });
        }
    }

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
                    <div>
                        <div className="flex flex-col items-start gap-y-5 w-full">
                            <Typography className={'font-bold'}>
                                Create a dispute
                            </Typography>
                            <FormControl fullWidth>
                                <AppTextInput placeholder='1bC45' disabled={true} label='Trade ID' val={orderId as string} />
                            </FormControl>

                            <label
                                htmlFor="amount"
                                className="text-sm font-medium text-white flex justify-between items-center"
                            >
                                <div className="text-md">Reason</div>
                            </label>
                            <TextareaAutosize
                                value={comment}
                                onChange={(e) => handleValChange(e.target.value)}
                                className="w-full text-sm font-normal font-sans leading-normal p-3 rounded-xl rounded-br-none shadow-lg shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300  dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0 box-border"
                                aria-label="empty textarea"
                                placeholder="Enter reason"
                            />
                        </div>
                        <div className={'flex gap-x-4 mt-8'}>
                            <Button
                                onClick={() => {
                                    onClose(); //close confirm dispute creation modal
                                    onDisputeOpen()
                                }}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateDispute}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                {isPending ? 'Creating' : 'Create'}
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
                </Box>
            </Modal>
            <Drawer
                anchor={'bottom'}
                open={isOpen}
                onClose={handleClose}
                className="md:hidden"

            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'}>
                    <div>
                        <div className="flex flex-col items-start gap-y-5 w-full">
                            <Typography className={'font-bold'}>
                                Create a dispute
                            </Typography>
                            <FormControl fullWidth>
                                <AppTextInput placeholder='1bC45' disabled={true} label='Trade ID' val={orderId as string} />
                            </FormControl>

                            <label
                                htmlFor="amount"
                                className="text-sm font-medium text-white flex justify-between items-center"
                            >
                                <div className="text-md">Reason</div>
                            </label>
                            <TextareaAutosize
                                value={comment}
                                onChange={(e) => handleValChange(e.target.value)}
                                className="w-full text-sm font-normal font-sans leading-normal p-3 rounded-xl rounded-br-none shadow-lg shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300  dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0 box-border"
                                aria-label="empty textarea"
                                placeholder="Enter reason"
                            />
                        </div>
                        <div className={'flex gap-x-4 mt-8'}>
                            <Button
                                onClick={() => {
                                    onClose(); //close confirm dispute creation modal
                                    onDisputeOpen()
                                }}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateDispute}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                {isPending ? 'Creating' : 'Create'}
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
                </Box>
            </Drawer>
        </>
    )
}

export default ConfirmDispute