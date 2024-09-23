import { Button, Checkbox, Divider, Radio, Switch } from '@mui/material'
import React from 'react'
import AppText from './AppText'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type Props = {
    handleClick: () => void
}
const ReviewBuyTrade = ({ handleClick }: Props) => {
    const [selectedValue, setSelectedValue] = React.useState('a');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    return (
        <main className='w-1/3'>
            <Button onClick={handleClick} className='text-white' startIcon={<ArrowBackIcon />}>Back</Button>

            <div className="p-6 rounded-lg w-full bg-gray-900">
                <div className='flex space-x-4 justify-between'>
                    <AppText text='Review Buy Trade' className='font-semibold' />
                    <AppText text='1.00 USDT = ₦1,498.78' className='font-medium text-gray-400 text-sm' />
                </div>
                <Divider className='mt-6' />
                <div className='my-4 flex flex-col space-y-4'>
                    <div className='flex justify-between'>
                        <AppText text='Amount to buy' />
                        <AppText text='NGN 500,000.00' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Amount to receive' />
                        <AppText text='500.00 USDT' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Buy to' />
                        <AppText text='0sE536....8292' />
                    </div>
                    <div className='flex justify-between'>
                        <AppText text='Fee' />
                        <AppText text='0.90 USDT' />
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
                        <div onClick={() => setSelectedValue('a')} className='flex cursor-pointer items-start w-full bg-gray-700 p-2 border border-solid border-gray-500 rounded-md'>
                            <Radio
                                checked={selectedValue === 'a'}
                                onChange={handleChange}
                                value="a"
                                name="radio-buttons"
                                inputProps={{ 'aria-label': 'A' }}
                            />
                            <div>
                                <AppText text='Bank Transfer' className='font-medium' />
                                <AppText text='Pay with your bank' className='font-thin text-gray-400 text-sm' />
                            </div>
                        </div>
                        <div onClick={() => setSelectedValue('b')} className='flex cursor-pointer items-start w-full bg-gray-700 p-2 border border-solid border-gray-500 rounded-md'>
                            <Radio
                                checked={selectedValue === 'b'}
                                onChange={handleChange}
                                value="b"
                                name="radio-buttons"
                                inputProps={{ 'aria-label': 'B' }}
                            />
                            <div>
                                <AppText text='Mobile Wallet' className='font-medium' />
                                <AppText text='Send from your mobile wallet' className='font-thin text-gray-400 text-sm' />
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
                            variant="outlined"
                            fullWidth
                            className="bg-gray-700 outline-gray-700 rounded-lg text-white capitalize w-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            className="bg-white rounded-lg text-black capitalize"
                        > Proceed to buy
                        </Button>
                    </section>
                </div>

            </div>
        </main>
    )
}

export default ReviewBuyTrade