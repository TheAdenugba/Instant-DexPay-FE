/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Drawer,
    IconButton,
    InputAdornment,
    Modal,
    TextField,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AppText from "../AppText";
import Close from "@/app/assets/icons/close";
import ChatUserIndicator from "@/app/assets/icons/chatUserIndicator";
import { Call, Copy, Paperclip2, Send2 } from "iconsax-react";
import ChatUserIcon from "@/app/assets/icons/chatUserIcon";
import {
    useClearMessageCount,
    useGetOrderById,
    useReceiveMessage,
    useSendMessage,
} from "@/services/mutations/chat.mutation";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";
import { getUsernameToDisplay } from "@/utils";
import { useRouter } from "next/navigation";
import Assets from "@/utils/assets";
import { persistor } from "@/store/store";

type IChatProps = {
    isOpen: boolean;
    onClose: () => void;
    id: string;
    onOpenConfirmPayment?: () => void;
    onSellerReleasedOpen?: () => void;
    makeRepaymentOpen?: () => void;
};
const Chat = ({ isOpen, onClose, id, onOpenConfirmPayment, onSellerReleasedOpen, makeRepaymentOpen }: IChatProps) => {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [orderMessages, setOrderMessages] = useState([] as any);
    const { user, socket } = useAppSelector((state) => state.userReducer);

    const { data: singleOrder } = useGetOrderById(id);
    const { data: messageData } = useReceiveMessage(id);
    const { mutateAsync: clearMessage } = useClearMessageCount();
    const { mutateAsync: send, isPending: isMsgSending } = useSendMessage();

    const handleSend = async () => {
        if (message == "") {
            toast.error("Input field cannot be blank", { id: "error" });
            return;
        }
        try {
            const response = await send({ message, orderId: id });
            setMessage("");
            if (response) {
                toast.success("Message sent successfully", {
                    id: "message sent",
                });

            }
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error",
            });
        }
    };

    const handleClear = async () => {
        try {
            await clearMessage({ orderId: id });
        } catch (error: any) {
            toast.error(error.response.data.message, {
                id: "error",
            });
        }
    };
    useEffect(() => {
        if (messageData?.data) setOrderMessages(messageData.data.reverse());
        if (id) handleClear();
    }, [messageData?.data]);

    useEffect(() => {
        if (socket) {
            socket.on("Token released", (data: any) => {
                if (data.payload._id === id) {
                    onSellerReleasedOpen?.()
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
                }
            });

            socket.once("Trade Cancel", (data: any) => {
                if (data.payload._id == id) {
                    toast.error(
                        `Trade with ${getUsernameToDisplay(
                            user?.username,
                            data?.payload?.sellerAddress?.user?.username,
                            data?.payload?.buyerAddress?.user?.username
                        )} has been cancelled`,
                        {
                            id: "merchant cancelled",
                            duration: 12000,
                        }
                    );
                    persistor.purge()
                    router.push("/instant-buy");

                }
            });
        }
    }, [socket]);
    const handleClose = (event: any, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown") return;
        onClose();
    };
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
                        "bg-gray-900 px-6 py-8 w-[90%] md:w-[60%] xl:w-[32%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] "
                    }
                >
                    <div className="flex items-center justify-between">
                        <AppText className="font-semibold text-xl" text={"Chat with Buyer"} />
                        <Close className="cursor-pointer"
                            onClick={() => {
                                onOpenConfirmPayment?.()
                                makeRepaymentOpen?.()
                                onClose()
                            }} />
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mt-10">
                        <div className="flex gap-x-3 items-center">
                            <ChatUserIndicator />
                            <div className="flex gap-x-4">
                                <AppText
                                    className="font-semibold"
                                    text={getUsernameToDisplay(
                                        user?.username,
                                        singleOrder?.data?.sellerAddress?.user?.username,
                                        singleOrder?.data?.buyerAddress?.user?.username
                                    )}
                                />
                                {singleOrder?.data?.sellerAddress?.user?.verifiedCheck && (
                                    <Image
                                        src={Assets.BADGE}
                                        width={16}
                                        height={16}
                                        alt="badge"
                                        style={{ marginLeft: "8px", verticalAlign: "middle" }}
                                    />
                                )}
                            </div>
                            <AppText
                                className="font-semibold text-sm sm:text-base md:hidden block"
                                text={
                                    singleOrder?.data?.sellerAddress?.user?.phoneNumber ||
                                    singleOrder?.data?.buyerAddress?.user?.phoneNumber
                                }
                            />
                        </div>
                        <Button
                            onClick={() =>
                                copyToClipBoard(
                                    singleOrder?.data?.sellerAddress?.user?.phoneNumber ||
                                    singleOrder?.data?.buyerAddress?.user?.phoneNumber
                                )
                            }
                            size="large"
                            className="bg-[#1e2939] text-white rounded-xl px-4 md:flex hidden"
                            startIcon={<Call size="15" color="#fff" />}
                            endIcon={<Copy size="15" color="#fff" />}
                        >
                            {singleOrder?.data?.sellerAddress?.user?.phoneNumber ||
                                singleOrder?.data?.buyerAddress?.user?.phoneNumber}
                        </Button>
                    </div>

                    <Divider
                        sx={{
                            border: "1px solid #1e2939",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    />

                    <div className="border border-solid border-[#DC6803] bg-[#F7900926] p-3 flex flex-col rounded-xl">
                        <AppText
                            className="font-semibold text-sm sm:text-base"
                            text={"Trade Instructions"}
                        />
                        <div className="overflow-y-auto max-h-[5rem]">
                            <AppText
                                className="font-normal text-sm sm:text-base text-[#D0D5DD] mt-2"
                                text={singleOrder?.data?.instruction}
                            />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto max-h-[14rem] py-2 space-y-4 mt-8">
                        {/* <!-- Incoming Message --> */}
                        {orderMessages.map((message: any, index: any) => {
                            return (
                                <div
                                    key={index}
                                    className={`flex items-end space-x-3 ${message?.sender === user._id ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message?.sender !== user._id ? <ChatUserIcon /> : null}
                                    <div
                                        className={`bg-gray-700 text-gray-300 text-sm sm:text-base p-3 ${message?.sender === user._id
                                            ? "rounded-lg rounded-br-none"
                                            : "rounded-lg rounded-bl-none"
                                            } w-full`}
                                    >
                                        {message?.message}
                                    </div>
                                    {message?.sender === user._id ? (
                                        <Avatar className="text-base uppercase" sx={{ bgcolor: "#C2EFFF" }}>
                                            {user?.firstName?.slice(0, 1)}
                                            {user?.lastName?.slice(0, 1)}
                                        </Avatar>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="mt-10 border border-solid border-[#344054]"
                        style={{
                            borderRadius: "15px",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e: any) => setMessage(e.target.value)}
                            multiline={true}
                            variant="standard"
                            placeholder="Type a message..."
                            InputProps={{
                                disableUnderline: true,
                                style: { color: "#B0B3B8", flex: 1 },
                                endAdornment: (
                                    <InputAdornment position="end" style={{ display: "flex", gap: "8px" }}>
                                        <IconButton edge="end">
                                            <Paperclip2 size="22" color="#344054" />
                                        </IconButton>
                                        <Divider
                                            orientation="vertical"
                                            variant="fullWidth"
                                            className="ml-4 border border-solid border-[#344054]"
                                            flexItem
                                        />
                                        <IconButton
                                            disabled={isMsgSending || !message.length}
                                            onClick={handleSend}
                                            edge="end"
                                        >
                                            {isMsgSending ? (
                                                <CircularProgress
                                                    sx={{ color: "white", marginLeft: "5px" }}
                                                    size={22}
                                                />
                                            ) : (
                                                <Send2 size="22" color="#344054" variant="Linear" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: "#0D0D1B", // Input background color
                                borderRadius: "15px",
                                padding: "8px 16px",
                                width: "100%",
                            }}
                        />
                    </div>
                </Box>
            </Modal>
            <Drawer
                anchor={'bottom'}
                open={isOpen}
                onClose={handleClose}
                className="md:hidden"
            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'} >
                    <div className="flex items-center justify-between">
                        <AppText className="font-semibold text-xl" text={"Chat with Buyer"} />
                        <Close className="cursor-pointer"
                            onClick={() => {
                                onOpenConfirmPayment?.()
                                makeRepaymentOpen?.()
                                onClose()
                            }} />
                    </div>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mt-10">
                        <div className="flex gap-x-3 items-center">
                            <ChatUserIndicator />
                            <div className="flex gap-x-4">
                                <AppText
                                    className="font-semibold"
                                    text={getUsernameToDisplay(
                                        user?.username,
                                        singleOrder?.data?.sellerAddress?.user?.username,
                                        singleOrder?.data?.buyerAddress?.user?.username
                                    )}
                                />
                                {singleOrder?.data?.sellerAddress?.user?.verifiedCheck && (
                                    <Image
                                        src={Assets.BADGE}
                                        width={16}
                                        height={16}
                                        alt="badge"
                                        style={{ marginLeft: "8px", verticalAlign: "middle" }}
                                    />
                                )}
                            </div>
                            <AppText
                                className="font-semibold text-sm sm:text-base md:hidden block"
                                text={
                                    singleOrder?.data?.sellerAddress?.user?.phoneNumber ||
                                    singleOrder?.data?.buyerAddress?.user?.phoneNumber
                                }
                            />
                        </div>
                        <Button
                            onClick={() =>
                                copyToClipBoard(
                                    singleOrder?.data?.sellerAddress?.user?.phoneNumber ||
                                    singleOrder?.data?.buyerAddress?.user?.phoneNumber
                                )
                            }
                            size="large"
                            className="bg-[#1e2939] text-white rounded-xl px-4 md:flex hidden"
                            startIcon={<Call size="15" color="#fff" />}
                            endIcon={<Copy size="15" color="#fff" />}
                        >
                            {singleOrder?.data?.sellerAddress?.user?.phoneNumber ||
                                singleOrder?.data?.buyerAddress?.user?.phoneNumber}
                        </Button>
                    </div>

                    <Divider
                        sx={{
                            border: "1px solid #1e2939",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    />

                    <div className="border border-solid border-[#DC6803] bg-[#F7900926] p-3 flex flex-col rounded-xl">
                        <AppText
                            className="font-semibold text-sm sm:text-base"
                            text={"Trade Instructions"}
                        />
                        <div className="overflow-y-auto max-h-[5rem]">
                            <AppText
                                className="font-normal text-sm sm:text-base text-[#D0D5DD] mt-2"
                                text={singleOrder?.data?.instruction}
                            />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto max-h-[14rem] py-2 space-y-4 mt-8">
                        {/* <!-- Incoming Message --> */}
                        {orderMessages.map((message: any, index: any) => {
                            return (
                                <div
                                    key={index}
                                    className={`flex items-end space-x-3 ${message?.sender === user._id ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message?.sender !== user._id ? <ChatUserIcon /> : null}
                                    <div
                                        className={`bg-gray-700 text-gray-300 text-sm sm:text-base p-3 ${message?.sender === user._id
                                            ? "rounded-lg rounded-br-none"
                                            : "rounded-lg rounded-bl-none"
                                            } w-full`}
                                    >
                                        {message?.message}
                                    </div>
                                    {message?.sender === user._id ? (
                                        <Avatar className="text-base uppercase" sx={{ bgcolor: "#C2EFFF" }}>
                                            {user?.firstName?.slice(0, 1)}
                                            {user?.lastName?.slice(0, 1)}
                                        </Avatar>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className="mt-10 border border-solid border-[#344054]"
                        style={{
                            borderRadius: "15px",
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e: any) => setMessage(e.target.value)}
                            multiline={true}
                            variant="standard"
                            placeholder="Type a message..."
                            InputProps={{
                                disableUnderline: true,
                                style: { color: "#B0B3B8", flex: 1 },
                                endAdornment: (
                                    <InputAdornment position="end" style={{ display: "flex", gap: "8px" }}>
                                        <IconButton edge="end">
                                            <Paperclip2 size="22" color="#344054" />
                                        </IconButton>
                                        <Divider
                                            orientation="vertical"
                                            variant="fullWidth"
                                            className="ml-4 border border-solid border-[#344054]"
                                            flexItem
                                        />
                                        <IconButton
                                            disabled={isMsgSending || !message.length}
                                            onClick={handleSend}
                                            edge="end"
                                        >
                                            {isMsgSending ? (
                                                <CircularProgress
                                                    sx={{ color: "white", marginLeft: "5px" }}
                                                    size={22}
                                                />
                                            ) : (
                                                <Send2 size="22" color="#344054" variant="Linear" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: "#0D0D1B", // Input background color
                                borderRadius: "15px",
                                padding: "8px 16px",
                                width: "100%",
                            }}
                        />
                    </div>

                </Box>
            </Drawer>
        </>
    );
};

export default Chat;
