import CloseIcon from '@/app/assets/icons/closeIcon'
import { Modal, Box, Divider, Button, Checkbox, Switch } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import AppText from '../AppText'
import AppTextInput from '../AppTextInput'
import { AppSelect } from '../AppSelect'

type Props = {
    isAdd: boolean;
    onAddClose: () => void
}
const AddPaymentModal = ({ isAdd, onAddClose }: Props) => {
    const [val, setVal] = useState('');
    const handleValChange = (event: ChangeEvent<HTMLInputElement>) => {
        setVal(event.target.value);
    };
    const handleSelect = () => {

    }

    return (
        <Modal
            open={isAdd}
            onClose={onAddClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={'bg-gray-900 p-4 w-[28%] rounded-xl absolute translate-x-[-50%] top-2/4 left-2/4 translate-y-[-50%] '} >
                <div className="flex flex-col space-y-4">
                    <div className='flex space-x-4 justify-between items-center px-2 mt-4'>
                        <AppText text='Add a payment method' className='font-semibold text-lg' />
                        <CloseIcon onClick={onAddClose} className='cursor-pointer' />
                    </div>
                    <Divider className='mb-3' />
                    <div className="flex flex-col space-y-4">
                        <AppSelect val='' label='Bank' options={[]} setSelectVal={handleSelect} />
                        <AppTextInput placeholder='xxxxxxxxx' label='Account Number' val={val} onChange={handleValChange} />
                        <AppTextInput placeholder='jon doe' disabled={true} label='Account Name' val={val} onChange={handleValChange} />
                    </div>
                </div>

                <div className='flex space-x-1 mt-3 items-center'>
                    <Checkbox className='text-[#F41449]' defaultChecked />
                    <AppText text='Set as default payment method' />
                </div>

                <Button size='large' onClick={() => { }} fullWidth className="bg-white rounded-xl text-black capitalize mt-6">
                    Done
                </Button>
            </Box>
        </Modal>
    )
}

export default AddPaymentModal