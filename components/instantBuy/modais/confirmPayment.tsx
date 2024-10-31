'use client'
import { Modal, Box, Button } from '@mui/material'
import React from 'react'
import AppText from '../../AppText'
import SpinnerIcon from '@/app/assets/icons/spinnerIcon'

type Props = {
    isConfirmPayment: boolean;
    onCloseConfirmPayment: () => void
}
const ConfirmPayment = ({ isConfirmPayment, onCloseConfirmPayment }: Props) => {
    return (
        <Modal
            open={isConfirmPayment}
            onClose={onCloseConfirmPayment}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',  // Semi-transparent background
                        backdropFilter: 'blur(10px)',
                    },
                },
            }}
        >
            <Box className={'bg-gray-900 px-5 py-8 w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] '} >
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-end mb-6">
                        <Button
                            //   onClick={onClose}
                            variant="outlined"
                            fullWidth={false}
                            size='large'
                            className="bg-gray-700 outline-gray-700 w-1/3 rounded-xl text-white text-md font-medium capitalize"
                        >
                            Contact Seller
                        </Button>
                    </div>
                    <div className='flex justify-center'>
                        <SpinnerIcon />
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-6'>
                        <AppText className="font-semibold text-xl" text='Confirming Payment' />
                        <AppText className="text-lg font-medium" text='Please hold on your payment is being confirmed' />
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-2 mt-6'>
                        <AppText className="text-gray-400 text-sm font-medium" text='Time left' />
                        <AppText className="font-semibold text-3xl" text='00:05' />
                    </div>
                </div>
                <section className="flex mt-10 space-x-4 w-full">
                    <Button
                        onClick={onCloseConfirmPayment}
                        variant="outlined"
                        fullWidth
                        size='large'
                        className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => { }}
                        variant="outlined"
                        fullWidth
                        size='large'
                        className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                    > Contact support
                    </Button>
                </section>
            </Box>
        </Modal>
    )
}

export default ConfirmPayment