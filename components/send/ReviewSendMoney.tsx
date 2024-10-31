import { Box, Button, Checkbox, Divider, Radio, Switch } from '@mui/material'
import React from 'react'
import AppText from '../AppText'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useDisclosure from '@/utils/useDisclosure';
import SendSuccessful from './modals/SendSuccessful';
import TransactionProcessingModal from './modals/TransactionProcessingModal';
import PaymentOptionModal from './modals/paymentOptionModal';
import AddUserModal from './modals/AddUserModal';
import AddPaymentModal from './modals/AddPaymentModal';
import Caution from '@/app/assets/icons/caution';
import AppTextInput from '../AppTextInput';
import BankIcon from '@/app/assets/icons/bankIcon';

type Props = {
    handleClick: () => void
}

const ReviewSendMoney = ({ handleClick }: Props) => {
    const [val, setVal] = React.useState('');
    const [isNote, setNote] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('a');
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { isOpen: isPayment, onClose: onClosePayment, onOpen: onOpenPayment } = useDisclosure()
    const { isOpen: isDexPay, onClose: onCloseDexPay, onOpen: onOpenDexPay } = useDisclosure()
    const { isOpen: isOption, onClose: onOptionClose, onOpen: onOptionOpen } = useDisclosure()
    const { isOpen: isConfirmPayment, onClose: onCloseConfirmPayment, onOpen: onOpenConfirmPayment } = useDisclosure()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };
    const onChange = (event) => {
        setNote(event.target.checked);
    };

    return (
        <main className='w-1/3'>
            <Button onClick={handleClick} className='text-white' startIcon={<ArrowBackIcon />}>Back</Button>

            <div className="px-6 py-9 rounded-lg w-full bg-gray-900">
                <div className='flex space-x-4 justify-between'>
                    <AppText text='Review Transaction' className='font-semibold text-lg' />
                    <AppText text='1.00 USDT = ₦1,498.78' className='font-medium text-gray-400 text-md' />
                </div>
                <Divider className='mt-6' />
                <div className='my-4 flex flex-col space-y-5'>
                    <div className='flex justify-between'>
                        <AppText text='Token amount' />
                        <AppText text='500.00 USDT' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Amount to receive' />
                        <AppText text='NGN 500,000.00' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Send from' />
                        <AppText text='0sE536....8292' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Network' />
                        <AppText text='BSC (BRC-20)' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Fee' />
                        <AppText text='0.90 USDT' />
                    </div>
                    <div className='flex justify-center'>
                        <Button
                            onClick={onOptionOpen}
                            variant="outlined"
                            fullWidth={false}
                            size='large'
                            className="bg-gray-700 border border-none rounded-xl text-white capitalize"
                        >
                            Add Recipient Details
                        </Button>
                    </div>

                    <div className="flex justify-between">
                        <AppText className='text-white' text='Recipient Details' />
                        <AppText className='text-[#F41449] cursor-pointer' text='Select another recipient' />
                    </div>
                    <Box className="bg-gray-800 border border-solid border-gray-700 rounded-lg p-2 flex items-center space-x-3">
                        <BankIcon />
                        <div className='flex flex-col text-sm text-gray-400'>
                            <AppText text='Access Bank' />

                            <div className="flex space-x-2">
                                <AppText text='0089567432' />
                                <AppText className='text-white' text='Titus Oluwagbenga' />
                            </div>

                        </div>
                    </Box>


                    <div className='flex items-center space-x-2'>
                        <Switch
                            // className='text-[#F41449]'
                            // inputProps={{ "aria-label": "Dark Mode" }}
                            onChange={onChange}
                        ></Switch>
                        <AppText text='Add Note/Memo' />
                    </div>
                    {!!isNote && <AppTextInput placeholder='Enter your note/memo' label='Note/Memo' val={val} onChange={() => { }} />}


                    <div className="flex space-x-4 w-full mb-5">
                        <div className='flex cursor-pointer items-start w-full bg-[#F790091A] p-2 border border-solid border-gray-500 rounded-md space-x-4'>
                            <Caution />
                            <div className='flex flex-col items-start'>
                                <AppText text={`You'll need to confirm two (2) wallet transactions`} className='text-sm' />
                                <div className="flex mt-3 space-x-4">
                                    <div className='flex items-center '>
                                        {/* <Checkbox className='text-[#F41449]' defaultChecked /> */}
                                        <input type="checkbox" name="" id="" />
                                        <AppText text='Approve token for transfer' />
                                    </div>

                                    <div className='flex items-center'>
                                        {/* <Checkbox className='text-[#F41449]' defaultChecked /> */}
                                        <input type="checkbox" name="" id="" />
                                        <AppText text='Confirm transaction' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex space-x-4 w-full mt-8">
                    <Button
                        onClick={handleClick}
                        variant="outlined"
                        fullWidth
                        size='large'
                        className="bg-gray-700 outline-gray-700 rounded-xl text-white capitalize w-full  border border-none"
                    >
                        Cancel
                    </Button>
                    {/* tips feature works around here */}
                    <Button
                        onClick={() =>
                            // onOpenConfirmPayment()
                            onOpen()
                        }
                        variant="outlined"
                        fullWidth
                        size='large'
                        className="bg-white rounded-xl text-[#0A0F19] capitalize  border border-none"
                    > Approve USDT
                    </Button>
                </div>
                <div className='flex justify-center mt-8'>
                    <AppText className='text-gray-600 text-lg' text={`© ${new Date().getFullYear()} Powered by DexPay`} />
                </div>

                <PaymentOptionModal
                    isOption={isOption}
                    onOptionClose={onOptionClose}
                    addDexPayUser={onOpenDexPay}
                    addPayment={onOpenPayment}
                />

                <AddUserModal isAdd={isDexPay} onAddClose={onCloseDexPay} />

                <AddPaymentModal isAdd={isPayment} onAddClose={onClosePayment} />

                <TransactionProcessingModal
                    isConfirmPayment={isConfirmPayment}
                    onCloseConfirmPayment={onCloseConfirmPayment} />

                <SendSuccessful handleReceipt={() => { }} isConfirmPayment={isOpen} onCloseConfirmPayment={onClose} />
            </div>

        </main>
    )
}

export default ReviewSendMoney