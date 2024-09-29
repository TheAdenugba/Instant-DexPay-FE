import { Button, Checkbox, Divider, Radio, Switch } from '@mui/material'
import React from 'react'
import AppText from '../AppText'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useDisclosure from '@/utils/useDisclosure';
import SendSuccessful from './SendSuccessful';
import TransactionProcessingModal from './TransactionProcessingModal';
import PaymentOptionModal from './paymentOptionModal';
import AddUserModal from './AddUserModal';
import AddPaymentModal from './AddPaymentModal';
import Caution from '@/app/assets/icons/caution';

type Props = {
    handleClick: () => void
}

const ReviewSendMoney = ({ handleClick }: Props) => {
    const [selectedValue, setSelectedValue] = React.useState('a');
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { isOpen: isPayment, onClose: onClosePayment, onOpen: onOpenPayment } = useDisclosure()
    const { isOpen: isDexPay, onClose: onCloseDexPay, onOpen: onOpenDexPay } = useDisclosure()
    const { isOpen: isOption, onClose: onOptionClose, onOpen: onOptionOpen } = useDisclosure()
    const { isOpen: isConfirmPayment, onClose: onCloseConfirmPayment, onOpen: onOpenConfirmPayment } = useDisclosure()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };
    return (
        <main className='w-1/3'>
            <Button onClick={handleClick} className='text-white' startIcon={<ArrowBackIcon />}>Back</Button>

            <div className="p-6 rounded-lg w-full bg-gray-900">
                <div className='flex space-x-4 justify-between'>
                    <AppText text='Review Transaction' className='font-semibold text-lg' />
                    <AppText text='1.00 USDT = ₦1,498.78' className='font-medium text-gray-400 text-md' />
                </div>
                <Divider className='mt-6' />
                <div className='my-4 flex flex-col space-y-4'>
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


                    <div className='flex justify-between items-center'>
                        <AppText text='Payment Method' />
                        <div className='flex items-center space-x-2'>
                            <AppText text='Auto-payout' className='font-thin' />
                            <AppText text='Wallet Bal: ₦200,000.00' className='text-gray-500 text-sm' />

                            <Switch
                                // checked={useDarkTheme}
                                inputProps={{ "aria-label": "Dark Mode" }}
                            // onChange={onChange}
                            ></Switch>
                        </div>
                    </div>
                    <div className="flex space-x-4 w-full">
                        <div className='flex cursor-pointer items-start w-full bg-[#F790091A] p-2 border border-solid border-gray-500 rounded-md space-x-2'>
                            <Caution />
                            <div>
                                <AppText text={`You'll need to confirm two (2) wallet transactions`} className='text-sm' />
                            </div>
                        </div>
                    </div>

                    <div className='flex space-x-1 items-center'>
                        <Checkbox className='text-[#F41449]' defaultChecked />
                        <AppText text='I agree to the' className='font-medium' />
                        <AppText text='Terms of Trade' className='font-medium underline' />
                    </div>

                    <section className="flex space-x-4 w-full">
                        <Button
                            onClick={handleClick}
                            variant="outlined"
                            fullWidth
                            size='large'
                            className="bg-gray-700 outline-gray-700 rounded-xl text-white capitalize w-full  border border-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => onOpen()}
                            variant="outlined"
                            fullWidth
                            size='large'
                            className="bg-white rounded-xl text-[#0A0F19] capitalize  border border-none"
                        > Proceed to buy
                        </Button>
                    </section>
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

                <SendSuccessful isConfirmPayment={isOpen} onCloseConfirmPayment={onClose} />
            </div>

        </main>
    )
}

export default ReviewSendMoney