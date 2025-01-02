import CloseIcon from "@/app/assets/icons/closeIcon";
import { Modal, Box, Drawer } from "@mui/material";
import React, { useState } from "react";
import AppText from "../../AppText";
import BankDetails from "../BankDetails";
import { useFetchPaymentAcct } from "@/services/mutations/swap.mutations";
import AddMobileWallet from "../AddMobileWallet";

type Props = {
    isOpenMobileWallet: boolean;
    onCloseMobileWallet: () => void;
};
export enum DETAILS {
    VIEW = "bank_details",
    ADD = "add_bank",
}
const MobileWalletModal = ({ isOpenMobileWallet, onCloseMobileWallet }: Props) => {
    const [details, setDetails] = useState(DETAILS.VIEW);
    const { data: paymentAcct } = useFetchPaymentAcct();

    const handleAddNew = () => {
        setDetails(DETAILS.ADD);
    };

    const obj = {
        [DETAILS.VIEW]: (
            <BankDetails
                onAddClose={onCloseMobileWallet}
                setDetails={setDetails}
                paymentAcct={paymentAcct}
                handleAddNew={handleAddNew}
            />
        ),
        [DETAILS.ADD]: <AddMobileWallet setDetails={setDetails} onAddClose={onCloseMobileWallet} />,
    };

    return (
        <>
            <Modal
                className="hidden md:block"
                open={isOpenMobileWallet}
                onClose={onCloseMobileWallet}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    className={
                        "bg-gray-900 p-4 w-[90%] md:w-[60%] xl:w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] "
                    }
                >
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4 justify-between items-center px-2 mt-4">
                            <AppText
                                text={`${details == DETAILS.VIEW ? "Select payment option" : "Add a payment method"
                                    }`}
                                className="font-semibold text-lg"
                            />
                            <CloseIcon
                                onClick={() => {
                                    setDetails(DETAILS.VIEW);
                                    onCloseMobileWallet();
                                }}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {/* view list of bank details if any or add a new one */}
                    {obj[details]}
                </Box>
            </Modal>
            <Drawer
                anchor={'bottom'}
                open={isOpenMobileWallet}
                onClose={onCloseMobileWallet}
                className="md:hidden"
            >
                <Box className={'bg-gray-900 p-7 w-full  rounded-t-sm'}>
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4 justify-between items-center px-2 mt-4">
                            <AppText
                                text={`${details == DETAILS.VIEW ? "Select payment option" : "Add a payment method"
                                    }`}
                                className="font-semibold text-lg"
                            />
                            <CloseIcon
                                onClick={() => {
                                    setDetails(DETAILS.VIEW);
                                    onCloseMobileWallet();
                                }}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {/* view list of bank details if any or add a new one */}
                    {obj[details]}
                </Box>
            </Drawer>
        </>
    );
};

export default MobileWalletModal;
