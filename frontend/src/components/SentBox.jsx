import React, { useState } from 'react'
import { MdCropSquare, MdInbox, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FaCaretDown, FaUserFriends } from "react-icons/fa";
import { IoMdMore, IoMdRefresh } from 'react-icons/io';
import Emails from './Emails';
import api from '../api';

const SentBox = () => {
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [refresh, setRefresh] = useState(false); // State to trigger refresh

    const deleteSelectedEmails = async () => {
        try {
            await api.post('api/v1/email/deleteMany', { ids: selectedEmails },{withCredentials:true});
            setRefresh(!refresh); // Toggle refresh state to trigger useEffect
        } catch (error) {
            console.error('Error deleting emails:', error);
        }
    };

    return (
        <div className='flex-1 mx-5 bg-white rounded-xl'>
            <div className='flex items-center justify-between px-4 my-2'>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1'>
                        <MdCropSquare size={'20px'} />
                        <FaCaretDown size={'20px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                        <IoMdRefresh size={'20px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                        <IoMdMore size={'20px'} />
                    </div>
                    {selectedEmails.length > 0 && (
                        <button onClick={deleteSelectedEmails} className='bg-red-500 text-white p-2 rounded'>Delete Selected</button>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    <span>1 to 50</span>
                    <MdKeyboardArrowLeft size={'24px'} />
                    <MdKeyboardArrowRight size={'24px'} />
                </div>
            </div>
            <div className='h-90vh overflow-y-auto'>
                <Emails setSelectedEmails={setSelectedEmails} selectedEmails={selectedEmails} refresh={refresh} />
            </div>
        </div>
    )
}

export default SentBox
