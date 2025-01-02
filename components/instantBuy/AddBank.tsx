/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import AppText from '../AppText'
import { Button, Checkbox } from '@mui/material'
import AppTextInput from '../AppTextInput'
import { CHANNEL, IPayment, useCreatePaymentAccount, useFetchBanks, useResolveAccount } from '@/services/mutations/swap.mutations'
import toast from 'react-hot-toast'
import { useDebounce } from "use-debounce";
import { DETAILS } from './modals/AddPaymentModal'
import SelectComponent, { SelectProps } from '../Select'
import { SingleValue } from 'react-select'

type Props = {
    onAddClose: () => void
    setDetails: React.Dispatch<React.SetStateAction<DETAILS>>
}

type IBank = {
    name: string
    code: string
}
const AddBank = ({ onAddClose, setDetails }: Props) => {
    const { data: banks } = useFetchBanks()
    const [check, setCheck] = useState(false);
    const [acctNo, setAcctNo] = useState('');
    const [debounceAcct] = useDebounce(acctNo, 1000);
    const [selectedBank, setSelectedBank] = useState<IBank>({} as IBank);
    const [acctName, setAcctName] = useState<string>('');
    const { mutateAsync: accountCreation } = useCreatePaymentAccount()
    const { mutateAsync: resolveAcct } = useResolveAccount()
    const handleValChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAcctNo(event.target.value);
    };

    const handleSelect = (e: SingleValue<SelectProps>) => {
        setSelectedBank({ code: e?.value as string, name: e?.label as string })
    }

    const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheck(event.target.checked);
    }

    const handleResolve = async () => {
        try {
            if (debounceAcct.length === 10) {
                toast.loading("Fetching account name", { duration: 999 })
                const res = await resolveAcct({ accountNumber: debounceAcct, bankCode: selectedBank.code })
                setAcctName(res.data.accountName)
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message, {
                id: "error",
            });
        }
    }

    useEffect(() => {
        if (debounceAcct && selectedBank) handleResolve()
    }, [debounceAcct, selectedBank])

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
                bankCode: selectedBank.code,
                accountNumber: acctNo,
                accountName: acctName,
                isDefault: check,
                paymentChannel: CHANNEL.BANK_TRANSFER
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
        return banks?.map((bank: IBank) => ({
            label: bank.name,
            value: bank.code
        }))
    }, [banks])
    return (
        <div>
            <div className="flex flex-col space-y-4 my-3">
                <div className="flex flex-col space-y-4">
                    <label
                        htmlFor="amount"
                        className="text-sm font-medium text-white flex justify-between items-center"
                    >
                        <div className="text-md">Bank</div>
                    </label>
                    {/* <AppSelect
                        name="banks"
                        value={selectedBank}
                        defaultValue="Bank transfer"
                        onChange={handleSelect}
                    >
                        {banks?.map((bank: IBank, id: string) => (
                            <MenuItem className="text-xs gap-x-2 flex justify-between" key={id} value={bank.name}>
                                <div>{bank.name}</div>
                            </MenuItem>
                        ))}
                    </AppSelect> */}
                    <SelectComponent
                        options={allBanks}
                        onChange={(el) => handleSelect(el as SingleValue<SelectProps>)}
                    // value={selectedBank}
                    />
                    <AppTextInput placeholder='xxxxxxxxx' label='Account Number' val={acctNo} onChange={handleValChange} />
                    <AppTextInput placeholder='jon doe' disabled={true} label='Account Name' val={acctName} />
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

                <Button size='medium' onClick={handleCreation} fullWidth className="bg-white rounded-lg text-black capitalize ">
                    Add
                </Button>
            </div>

        </div>
    )
}

export default AddBank