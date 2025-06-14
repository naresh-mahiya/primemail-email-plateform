import React, { useState } from 'react'
import { MdCropSquare, MdInbox, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FaCaretDown, FaUserFriends } from "react-icons/fa";
import { IoMdMore, IoMdRefresh } from 'react-icons/io';
import { GoTag } from "react-icons/go";
import Emails from './Emails';
import api from '../api'


const mailType = [
    {
        icon: <MdInbox size={'20px'} />,
        text: "Primary"
    },
    {
        icon: <GoTag size={'20px'} />,
        text: "Promotions"
    },
    {
        icon: <FaUserFriends size={'20px'} />,
        text: "Social"
    }

]

const Inbox = () => {

    const [selected, setSelected] = useState(0)//if nothing selected then show 0th index i.e. primary
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [refresh, setRefresh] = useState(false); // State to trigger refresh

    const deleteSelectedEmails = async () => {
        try {
            await api.post('api/v1/email/deleteMany', { ids: selectedEmails });
            setRefresh(!refresh); // Toggle refresh state to trigger useEffect
        } catch (error) {
            console.error('Error deleting emails:', error);
        }
    };

    return (
        <div className='flex-1 bg-white rounded-xl mx-5'>
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
                <div className='flex items-center gap-1 '>
                    {mailType.map((item, index) => {
                        return (
                            <button onClick={() => setSelected(index)} key={index} className={`${selected == index ? "border-b-4 border-b-blue-600 text-blue-600" : "border-b-4 border-b-transparent"} flex items-center gap-5 p-4 w-52 hover:bg-gray-200`}>
                                {item.icon}
                                <span>{item.text}</span>
                            </button>
                        )
                    })
                    }
                </div>
                <Emails setSelectedEmails={setSelectedEmails} selectedEmails={selectedEmails} refresh={refresh} />
            </div>
        </div>
    )
}

export default Inbox
