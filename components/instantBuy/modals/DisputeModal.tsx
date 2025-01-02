"use client";
import { Modal, Box, Button, Typography, Drawer } from "@mui/material";
import React from "react";
import Image from "next/image";
import Assets from "@/utils/assets";
import useDisclosure from "@/utils/useDisclosure";
import ConfirmDispute from "./ConfirmDispute";

type Props = {
    isDisputeOpen: boolean;
    onDisputeClose: () => void;
    onOpenConfirmPayment: () => void;
    onDisputeOpen: () => void;
};
const DisputeModal = ({
    onDisputeOpen,
    isDisputeOpen,
    onDisputeClose,
    onOpenConfirmPayment,
}: Props) => {
    const { WARNING } = Assets;
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleClose = (event: unknown, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown") return;
        onDisputeClose(); //close dispute modal and open confirm payment modal
        onOpenConfirmPayment();
    };
    return (
        <>
            <Modal
                className="hidden md:block"
                disableEscapeKeyDown={true}
                open={isDisputeOpen}
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
                            <Typography className={"font-bold"}>Confirm dispute?</Typography>
                            <Typography
                                variant="body2"
                                className={"text-center font-semibold text-gray-200"}
                            >
                                Are to sure you want to dispute this trade?
                            </Typography>
                        </div>
                        <div className={"flex gap-x-4 mt-8"}>
                            <Button
                                onClick={() => {
                                    onOpenConfirmPayment();
                                    onDisputeClose();
                                }}
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    onOpen();
                                    onDisputeClose();
                                }}
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>

            <Drawer
                anchor={'bottom'}
                open={isDisputeOpen}
                onClose={handleClose}
                className="md:hidden"
            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'}>
                    <div>
                        <div className="flex flex-col items-center gap-y-5">
                            <Image src={WARNING} alt="warning" width={48} height={48} />
                            <Typography className={"font-bold"}>Confirm dispute?</Typography>
                            <Typography
                                variant="body2"
                                className={"text-center font-semibold text-gray-200"}
                            >
                                Are to sure you want to dispute this trade?
                            </Typography>
                        </div>
                        <div className={"flex gap-x-4 mt-8"}>
                            <Button
                                onClick={() => {
                                    onOpenConfirmPayment();
                                    onDisputeClose();
                                }}
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    onOpen();
                                    onDisputeClose();
                                }}
                                variant="outlined"
                                fullWidth
                                size="medium"
                                className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium space-x-1"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Box>
            </Drawer>
            <ConfirmDispute isOpen={isOpen} onClose={onClose} onDisputeOpen={onDisputeOpen} />
        </>
    );
};

export default DisputeModal;
