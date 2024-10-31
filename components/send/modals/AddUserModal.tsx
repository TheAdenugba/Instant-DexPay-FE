import CloseIcon from '@/app/assets/icons/closeIcon'
import { Modal, Box, Divider, Button } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import AppText from '../../AppText'
import AppTextInput from '../../AppTextInput'

type Props = {
    isAdd: boolean;
    onAddClose: () => void
}
const AddUserModal = ({ isAdd, onAddClose }: Props) => {
    const [val, setVal] = useState('');
    const handleValChange = (event: ChangeEvent<HTMLInputElement>) => {
        setVal(event.target.value);
    };

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
                        <AppText text='Add a dexpay user' className='font-semibold text-lg' />
                        <CloseIcon onClick={onAddClose} className='cursor-pointer' />
                    </div>
                    <Divider className='mb-3' />
                    <AppTextInput placeholder={'Enter dexpay username'} label='Dexpay Username' val={val} onChange={handleValChange} />
                </div>

                <Button size='large' onClick={() => { }} fullWidth className="bg-white rounded-xl text-black capitalize mt-6">
                    Done
                </Button>
            </Box>
        </Modal>
    )
}

export default AddUserModal