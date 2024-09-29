import SpinnerIcon from '@/app/assets/icons/spinnerIcon';
import { Modal, Box } from '@mui/material';
import React from 'react'
import AppText from '../AppText';
import CloseIcon from '@/app/assets/icons/closeIcon';
import UserIcon from '@/app/assets/icons/userIcon';
import BankIcon from '@/app/assets/icons/bankIcon';
import MobileWallet from '@/app/assets/icons/mobileWallet';

type Props = {
    isOption: boolean;
    onOptionClose: () => void;
    addDexPayUser: () => void
    addPayment: () => void
}
const PaymentOptionModal = ({ isOption, onOptionClose, addDexPayUser, addPayment }: Props) => {

    return (
        <Modal
            open={isOption}
            onClose={onOptionClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={'bg-gray-900 p-4 w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] '} >
                <div className="flex flex-col space-y-4">
                    <div className='flex space-x-4 justify-between items-center px-2 mt-4'>
                        <AppText text='Select payment option' className='font-semibold text-lg' />
                        <CloseIcon onClick={onOptionClose} className='cursor-pointer' />
                    </div>

                    <div>
                        <div
                            onClick={() => {
                                addDexPayUser()
                                onOptionClose()
                            }}
                            className='flex items-center cursor-pointer my-3 space-x-4 border border-gray-600 border-solid p-6  rounded-lg'>
                            <UserIcon />
                            <AppText className="text-md" text='DexPay User' />
                        </div>
                        <div
                            onClick={() => {
                                addPayment()
                                onOptionClose()
                            }}
                            className='flex items-center cursor-pointer my-3 space-x-4 border border-gray-600 border-solid p-6  rounded-lg'>
                            <BankIcon />
                            <AppText className="text-md" text='Bank Transfer' />
                        </div>
                        <div className='flex items-center cursor-pointer my-3 space-x-4 border border-gray-600 border-solid p-6  rounded-lg'>
                            <MobileWallet />
                            <AppText className="text-md" text='Mobile Wallet' />
                        </div>
                    </div>
                </div>

            </Box>
        </Modal>
    )
}

export default PaymentOptionModal