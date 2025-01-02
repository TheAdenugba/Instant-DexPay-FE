import Assets from '@/utils/assets'
import { Modal, Box, Typography, Button, CircularProgress, Drawer } from '@mui/material'
import React from 'react'
import Image from 'next/image'

interface Props {
    isCancel: boolean;
    cancelLoading: boolean;
    onClose: () => void;
    handleCancel: () => void;
    repaymentModalOpen: () => void;
}
const CancelModal = ({ isCancel, onClose, handleCancel, cancelLoading, repaymentModalOpen }: Props) => {
    const { WARNING } = Assets


    const handleClose = (event: unknown, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown")
            return;
        onClose();
        repaymentModalOpen()
    }
    return (
        <>
            <Modal
                className="hidden md:block"
                disableEscapeKeyDown={true}
                onClose={handleClose}
                open={isCancel}
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
                        <div className="flex flex-col items-center gap-y-5">
                            <Image
                                src={WARNING}
                                alt="warning"
                                width={48}
                                height={48}
                            />
                            <Typography className={'font-bold'}>
                                Cancel trade?
                            </Typography>
                            <Typography variant="body2" className={'text-center font-semibold text-gray-200'}>
                                Are you sure you want to cancel this trade and terminate the transaction?
                            </Typography>
                        </div>
                        <div className={'flex gap-x-4 mt-8'}>
                            <Button
                                onClick={() => {
                                    repaymentModalOpen()
                                    onClose();
                                }}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                {cancelLoading ? "Cancelling" : "Yes, Cancel"}
                                {cancelLoading && (
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
                onClose={handleClose}
                open={isCancel}
                className="md:hidden"
            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'}>
                    <div>
                        <div className="flex flex-col items-center gap-y-5">
                            <Image
                                src={WARNING}
                                alt="warning"
                                width={48}
                                height={48}
                            />
                            <Typography className={'font-bold'}>
                                Cancel trade?
                            </Typography>
                            <Typography variant="body2" className={'text-center font-semibold text-gray-200'}>
                                Are you sure you want to cancel this trade and terminate the transaction?
                            </Typography>
                        </div>
                        <div className={'flex gap-x-4 mt-8'}>
                            <Button
                                onClick={() => {
                                    repaymentModalOpen()
                                    onClose();
                                }}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outlined"
                                fullWidth
                                size='medium'
                                className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                {cancelLoading ? "Cancelling" : "Yes, Cancel"}
                                {cancelLoading && (
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

export default CancelModal