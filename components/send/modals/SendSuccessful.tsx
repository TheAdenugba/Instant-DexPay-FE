'use client'
import { Modal, Box, Button } from '@mui/material'
import React from 'react'
import AppText from '../../AppText'
import SuccessIcon from '@/app/assets/icons/successIcon'

type Props = {
    isConfirmPayment: boolean;
    onCloseConfirmPayment: () => void
    handleReceipt: () => void
}
const SendSuccessful = ({ isConfirmPayment, onCloseConfirmPayment, handleReceipt }: Props) => {
    return (
        <Modal
            open={isConfirmPayment}
            onClose={onCloseConfirmPayment}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={'bg-gray-900 p-4 w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] '} >
                <div className="flex flex-col space-y-4">

                    <div className='flex justify-center'>
                        <SuccessIcon />
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-6'>
                        <AppText className="font-semibold text-xl" text='Payment successful' />
                        <AppText className="text-md font-medium text-center" text={`Your payment of #500,000.00 to Titus Adenugba, ******7086 Access Bank is successful.`} />
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
                        View in explorer
                    </Button>
                    <Button
                        onClick={() => handleReceipt}
                        variant="outlined"
                        fullWidth
                        size='large'
                        className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                    > Download Receipt
                    </Button>
                </section>
            </Box>
        </Modal>
    )
}

export default SendSuccessful