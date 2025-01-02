/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from "@/app/assets/icons/addIcon";
import { Button } from "@mui/material";
import React from "react";
import AppText from "../AppText";
import BankIcon from "@/app/assets/icons/bankIcon";
import { useAppDispatch } from "@/store/hooks";
import { updatePaymentAccount } from "@/store/slices/traderSlice";
import { DETAILS } from "./modals/AddPaymentModal";

type Props = {
    onAddClose: () => void
    handleAddNew: () => void;
    paymentAcct: Record<string, any>[];
    setDetails: React.Dispatch<React.SetStateAction<DETAILS>>;
}
const BankDetails = ({ handleAddNew, paymentAcct, setDetails, onAddClose }: Props) => {
    const dispatch = useAppDispatch();
    const captureBankDetails = (el: any) => {
        dispatch(updatePaymentAccount({
            id: el?._id,
            bankName: el?.bankName,
            accountName: el?.accountName,
            bankCode: el?.bankCode,
            accountNumber: el?.accountNumber,
        }))
        setDetails(DETAILS.VIEW)
        onAddClose()
    }
    return (
        <div>
            {!paymentAcct?.length ?
                <div className="flex justify-center my-6">
                    <AppText className="text-lg font-semibold" text={'No payment accounts found'} />
                </div>
                : paymentAcct?.map((el, id) => (
                    <div
                        key={id}
                        onClick={() => captureBankDetails(el)}
                        className="flex items-center cursor-pointer my-3 space-x-4 border border-gray-600 border-solid p-6 rounded-lg mt-6"
                    >
                        <BankIcon />
                        <div className="font-semibold">
                            <AppText className="text-sm text-gray-400" text={el?.bankName} />
                            <div className="flex gap-x-3">
                                <AppText className="text-sm text-gray-400" text={el?.accountNumber} />
                                <AppText className="text-sm" text={el?.accountName} />
                            </div>
                        </div>
                    </div>
                ))}
            <Button
                onClick={handleAddNew}
                variant="outlined"
                fullWidth
                className="bg-gray-700 outline-gray-700 rounded-lg text-white capitalize w-full mt-5"
            >
                <AddIcon className="mr-2" />
                Add new payment account
            </Button>
        </div>
    );
};

export default BankDetails;
