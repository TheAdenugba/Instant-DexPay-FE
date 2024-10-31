import { Modal, Box, Button } from '@mui/material'
import React from 'react'
import AppText from '../AppText'

type Props = {
    isOpen: boolean
    onClose: () => void
    onOpenConfirmPayment: () => void
}
const MakeRepayment = ({ isOpen, onClose, onOpenConfirmPayment }: Props) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
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
            <Box className={'bg-gray-900 p-7 w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] '} >
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                        <AppText className='font-semibold text-xl' text='Make Payment' />
                        <AppText className='text-[#FC3F6B]' text='29:23' />
                    </div>
                    <div className='flex flex-col items-center justify-center space-y-3'>
                        <AppText className="font-semibold text-3xl" text='₦93,625.00' />
                        <AppText className="text-gray-400 text-lg font-medium" text='50.00 USDT' />
                    </div>
                    <div className='mt-3'>
                        <AppText className="font-semibold text-xl" text='Bank Transfer' />
                    </div>

                    <div className='flex flex-col space-y-4 font-semibold'>
                        <div className='flex justify-between'>
                            <AppText className="text-gray-400" text='Bank' />
                            <AppText text='Access Bank' />
                        </div>

                        <div className='flex justify-between'>
                            <AppText className="text-gray-400" text='Account Number' />
                            <AppText text='1234567890' />
                        </div>

                        <div className='flex justify-between'>
                            <AppText className="text-gray-400" text='Account Name' />
                            <AppText text='Lorem Ipsum' />
                        </div>

                        <div className='flex justify-between'>
                            <AppText className="text-gray-400" text='Rate' />
                            <AppText text='1.00 USDT = ₦1,498.78' />
                        </div>
                    </div>
                </div>
                <section className="flex mt-12 space-x-4 w-full">
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        fullWidth
                        size='medium'
                        className="bg-gray-700 outline-gray-700 rounded-xl text-white text-md font-medium capitalize w-full"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onClose()
                            onOpenConfirmPayment()
                        }}
                        variant="outlined"
                        fullWidth
                        size='medium'
                        className="bg-white rounded-xl text-[#0A0F19] capitalize text-md font-medium"
                    > I have made this payment
                    </Button>
                </section>
            </Box>
        </Modal>
    )
}

export default MakeRepayment