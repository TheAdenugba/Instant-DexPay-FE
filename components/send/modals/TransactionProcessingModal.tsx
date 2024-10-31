'use client'
import { Modal, Box, Button } from '@mui/material'
import React from 'react'
import AppText from '../../AppText'
import SpinnerIcon from '@/app/assets/icons/spinnerIcon'

type Props = {
    isConfirmPayment: boolean;
    onCloseConfirmPayment: () => void
}
const TransactionProcessingModal = ({ isConfirmPayment, onCloseConfirmPayment }: Props) => {
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
                        <SpinnerIcon />
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-6'>
                        <AppText className="font-semibold text-xl" text='Transaction Processing' />
                        <AppText className="text-md font-medium text-center" text='Your payment of #500,000.00 is on its way to Titus Adenugba, ******7086 Access Bank.' />
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-2 mt-6'>
                        <AppText className="text-gray-400 text-sm font-medium" text='Time left' />
                        <AppText className="font-semibold text-3xl" text='00:05' />
                    </div>
                </div>

            </Box>
        </Modal>
    )
}

export default TransactionProcessingModal