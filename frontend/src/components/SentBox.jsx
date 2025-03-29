import React from 'react'
import { MdCropSquare, MdInbox, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { FaCaretDown, FaUserFriends } from "react-icons/fa";
import { IoMdMore, IoMdRefresh } from 'react-icons/io';
import Emails from './Emails';


const SentBox = () => {
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
                </div>
                <div className='flex items-center gap-2'>
                    <span>1 to 50</span>
                    <MdKeyboardArrowLeft size={'24px'} />
                    <MdKeyboardArrowRight size={'24px'} />
                </div>
            </div>
            <div className='h-90vh overflow-y-auto'>
                <Emails />
            </div>
        </div>
    )
}

export default SentBox
