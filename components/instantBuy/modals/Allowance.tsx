/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Success from "@/app/assets/images/success.gif";
import { useTradeTopUp } from '@/services/mutations/swap.mutations';
import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi';
import abi from "../../../token-abi.json";
import { fetchTokenAddress } from '@/utils';
import { ethers } from 'ethers';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/utils/config';
import { Box, Button, CircularProgress, Drawer, Modal } from '@mui/material';
import AppText from '@/components/AppText';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    selectedValue: string;
    asset: string;
}
const Allowance = ({ isOpen, onClose, asset, selectedValue }: Props) => {
    const [transHash, setTransHash] = useState("");
    const { isPending, writeContractAsync } = useWriteContract();
    const { assets } = useAppSelector((state) => state.countryReducer);
    const { mutateAsync: topUp, isPending: topUpLoading } = useTradeTopUp()

    const {
        data: txReceipt,
        // error: txError,
        isLoading: txLoading,
    } = useWaitForTransactionReceipt({
        confirmations: 3,
        hash: transHash as `0x${string}`,
    });

    useEffect(() => {
        if (txReceipt) {
            toast.dismiss();
            toast.success("Transaction fully confirmed.", {
                id: "confirmed",
            });
            onClose();
        }
    }, [txReceipt]);

    const handleApproveAllowance = async () => {
        try {
            const etherValue = ethers.parseEther(String(1000000000000000 + Number(selectedValue)));
            const hexValue = ethers.hexlify(ethers.toBeHex(etherValue));
            const res = await writeContractAsync({
                address: fetchTokenAddress(assets, asset) as `0x${string}`,
                abi,
                functionName: "approve",
                args: [
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                    hexValue,
                ],
            });

            // console.log("See this>>>>>>>" + JSON.stringify(res));

            if (isPending) {
                toast.loading(`Pls wait while your approval is being confirmed.`, {
                    duration: 9999999999999,
                    id: "loading",
                });
            }

            if (res) {
                setTransHash(res);
                //console.log("this is response" + JSON.stringify(receipt));
                toast.dismiss();

                // Update the loading toast with the current number of confirmations
                toast.loading(`Transaction is currently ongoing confirmation.`, {
                    duration: 9999999999999,
                });
            } else {
                // Transaction failed or was reverted
                toast.error("Transaction failed", {
                    id: "error",
                });
            }
        } catch (error: any) {
            toast.error(error?.message);
            return;
            //console.error(error);
        }
    };

    const handleTopUp = async () => {
        try {
            const response = await topUp()
            if (response.data.status == false) {
                handleApproveAllowance();
            } else {
                const hash = response.data?.message?.transactionHash;

                if (hash) {
                    //setTransHash(hash)
                    toast.loading(
                        `Top up transaction is currently ongoing confirmation.`,
                        { duration: 9999999999999 }
                    );

                    const data = await waitForTransactionReceipt(config, {
                        confirmations: 6,
                        hash,
                    });

                    if (data) {
                        toast.dismiss();
                        toast.success("Top up transaction confirmed.", {
                            id: "confirmed",
                        });
                        handleApproveAllowance();
                    }
                }
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, {
                id: "error",
            });
            return;
        }
    };

    const handleClose = (event: unknown, reason: string) => {
        if (reason && reason == "backdropClick" && "escapeKeyDown")
            return;
        onClose();
    }
    return (
        <>
            <Modal
                disableEscapeKeyDown={true}
                className="hidden md:block"
                open={isOpen}
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
                            <AppText className="font-semibold text-xl" text="Not enough allowance for trade" />
                            <AppText
                                className="text-md font-medium text-center"
                                text="Click approve token to give allowance to this trade and wait for few seconds for success notification"
                            />
                        </div>
                    </div>
                    <section className="flex mt-10 gap-4 w-full">
                        <Button
                            onClick={() => handleTopUp()}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                        >
                            {" "}
                            Approve Token
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
                        <div className="flex justify-center">
                            <Image
                                src={Success}
                                alt="logo"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <AppText className="font-semibold text-xl" text="Not enough allowance for trade" />
                            <AppText
                                className="text-md font-medium text-center"
                                text="Click approve token to give allowance to this trade and wait for few seconds for success notification"
                            />
                        </div>
                    </div>
                    <section className="flex mt-10 gap-4 w-full">
                        <Button
                            onClick={() => handleTopUp()}
                            variant="outlined"
                            fullWidth
                            size="large"
                            className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                        >
                            {" "}
                            Approve Token
                            {topUpLoading || txLoading && (
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
                    </section>
                </Box>
            </Drawer>
        </>
    )
}

export default Allowance