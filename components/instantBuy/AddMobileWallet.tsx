/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useMemo, useState } from 'react'
import AppText from '../AppText'
import { Button, Checkbox } from '@mui/material'
import AppTextInput from '../AppTextInput'
import { CHANNEL, IPayment, useCreatePaymentAccount, useFetchBanks } from '@/services/mutations/swap.mutations'
import toast from 'react-hot-toast'
import { DETAILS } from './modals/AddPaymentModal'
import SelectComponent, { SelectProps } from '../Select'
import { SingleValue } from 'react-select'
import { mobileWallets } from '@/utils/mobileWallets'

type Props = {
    onAddClose: () => void
    setDetails: React.Dispatch<React.SetStateAction<DETAILS>>
}

type IWallet = {
    name: string
    value: string
}
const AddMobileWallet = ({ onAddClose, setDetails }: Props) => {
    const { data: banks } = useFetchBanks()
    const [check, setCheck] = useState(false);
    const [acctNo, setAcctNo] = useState('');
    const [selectedBank, setSelectedBank] = useState<IWallet>({} as IWallet);
    const [acctName, setAcctName] = useState<string>('');
    const { mutateAsync: accountCreation } = useCreatePaymentAccount()
    const handleValChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAcctNo(event.target.value);
    };
    const handleAccountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAcctName(event.target.value);
    };

    const handleSelect = (e: SingleValue<SelectProps>) => {
        setSelectedBank({ value: e?.value as string, name: e?.label as string })
    }

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(event.target.checked);
    }

    const handleCreation = async () => {
        try {
            if (!selectedBank.name) {
                toast.error("Oops, Select a bank", {
                    id: "error",
                });
                return
            }
            if (!acctNo) {
                toast.error("Oops, Enter an account number", {
                    id: "error",
                });
                return
            }
            toast.loading('Creating payment details')
            const payload: IPayment = {
                bankName: selectedBank.name,
                bankCode: selectedBank.value,
                accountNumber: acctNo,
                accountName: acctName,
                isDefault: check,
                paymentChannel: CHANNEL.MOBILE_MONEY
            }
            await accountCreation(payload)
            toast.success('Successfully created payment account')
            onAddClose()
            setDetails(DETAILS.VIEW)
        } catch (error: any) {
            toast.error(error?.response?.data?.message, {
                id: "error",
            });
        }
    }


    const allBanks = useMemo(() => {
        return mobileWallets?.map((bank: IWallet) => ({
            label: bank.name,
            value: bank.value
        }))
    }, [banks])
    return (
        <div>
            <div className="flex flex-col space-y-4 my-3">
                <div className="flex flex-col space-y-4">
                    <label
                        htmlFor="name"
                        className="text-sm font-medium text-white flex justify-between items-center"
                    >
                        <div className="text-md">Mobile Wallet Name</div>
                    </label>
                    <SelectComponent
                        options={allBanks}
                        onChange={(el) => handleSelect(el as SingleValue<SelectProps>)}
                    // value={selectedBank}
                    />
                    <AppTextInput placeholder='xxxxxxxxx' label='Account Number' val={acctNo} onChange={handleValChange} />
                    <AppTextInput placeholder='jon doe' label='Account Name' val={acctName} onChange={handleAccountChange} />
                </div>
            </div>

            <div className='flex space-x-1 mt-3 items-center'>
                <Checkbox className='text-[#F41449]'
                    checked={check}
                    onChange={handleChecked} />
                <AppText text='Set as default payment method' />
            </div>

            <div className='flex gap-x-3 mt-6'>
                <Button
                    onClick={() => {
                        setDetails(DETAILS.VIEW)
                        onAddClose()
                    }}
                    variant="outlined"
                    fullWidth
                    size='medium'
                    className="bg-gray-700 outline-gray-700 rounded-lg text-white capitalize"
                >
                    Cancel
                </Button>

                <Button
                    disabled={!check}
                    size='medium' onClick={handleCreation} fullWidth className={`bg-white rounded-lg text-black capitalize ${!check ? 'cursor-not-allowed' : 'cursor-pointer'}
                                ${!check ? "disabled:bg-gray-500 disabled:text-gray-900" : ""}`}>
                    Add
                </Button>
            </div>

        </div>
    )
}

export default AddMobileWallet