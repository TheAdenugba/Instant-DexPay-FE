"use client";
import { Modal, Box, Button, Typography, Drawer, CircularProgress } from "@mui/material";
import React from "react";
import Image from "next/image";
import Assets from "@/utils/assets";

type Props = {
    isCancelConfirmed: boolean;
    onConfirmClose: () => void;
    onOpenMakeRepayment: () => void;
    handleTransferred: () => void;
    isConfirming: boolean;
};
const InitialConfirmPayment = ({
    isCancelConfirmed,
    onConfirmClose,
    onOpenMakeRepayment,
    handleTransferred,
    isConfirming
}: Props) => {
    const { WARNING } = Assets;
    // const { isOpen, onClose, onOpen } = useDisclosure();

    const handleClose = (event: unknown, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown") return;
        onConfirmClose(); //close dispute modal and open confirm payment modal
        onOpenMakeRepayment();
    };
    return (
        <>
            <Modal
                className="hidden md:block"
                disableEscapeKeyDown={true}
                open={isCancelConfirmed}
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
                        <div className="flex flex-col items-center gap-y-5">
                            <Image src={WARNING} alt="warning" width={48} height={48} />
                            <Typography className={"font-bold"}>Confirm payment?</Typography>
                            <Typography
                                variant="body2"
                                className={"text-center font-semibold text-gray-200"}
                            >
                                Are you sure you have sent the exact amount to the seller?
                            </Typography>
                        </div>
                        <div className={"flex gap-x-4 mt-8"}>
                            <Button
                                onClick={() => {
                                    onConfirmClose();
                                    onOpenMakeRepayment();
                                }}
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize w-full"
                            >
                                No
                            </Button>
                            <Button
                                onClick={() => {
                                    handleTransferred();
                                }}
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="bg-white rounded-lg text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                Yes, confirm
                                {isConfirming && (
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
                open={isCancelConfirmed}
                onClose={handleClose}
                className="md:hidden"

            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'} >
                    <div className="flex flex-col items-center gap-y-5">
                        <Image src={WARNING} alt="warning" width={48} height={48} />
                        <Typography className={"font-bold"}>Confirm Payment?</Typography>
                        <Typography
                            variant="body2"
                            className={"text-center font-semibold text-gray-200"}
                        >
                            Are you sure you have sent the exact amount to the seller?
                        </Typography>
                    </div>
                    <div className={"flex gap-x-4 mt-8"}>
                        <Button
                            onClick={() => {
                                onConfirmClose();
                                onOpenMakeRepayment();
                            }}
                            variant="outlined"
                            fullWidth
                            size="medium"
                            className="bg-gray-700 outline-gray-700 rounded-lg text-white text-md font-medium capitalize w-full"
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                handleTransferred();
                            }}
                            variant="outlined"
                            fullWidth
                            size="medium"
                            className="bg-white rounded-lg text-[#0A0F19] capitalize text-md font-medium space-x-1"
                        >
                            Yes, confirm
                            {isConfirming && (
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
                </Box>
            </Drawer>
        </>
    );
};

export default InitialConfirmPayment;
