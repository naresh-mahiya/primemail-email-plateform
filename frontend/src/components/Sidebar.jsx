import React from 'react'
import { LuPencil } from "react-icons/lu";
import { MdInbox, MdOutlineDrafts, MdOutlineExpandMore } from "react-icons/md";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlineWatchLater } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { useDispatch } from 'react-redux';
import { setOpen } from '../redux/appSlice.js'
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarItems = [
    {
        icon: <MdInbox size={'22px'} />,
        text: 'Inbox',
        to:'/'
    },
    {
        icon: <IoMdStarOutline size={'22px'} />,
        text: 'Starred',
        to:'#'
    },
    {
        icon: <MdOutlineWatchLater size={'22px'} />,
        text: 'Snoozed',
        to:'#'
    },
    {
        icon: <TbSend2 size={'22px'} />,
        text: 'Sent',
        to:'sent'
    },
    {
        icon: <MdOutlineDrafts size={'22px'} />,
        text: 'Drafts',
        to:'#'
    },
    {
        icon: <MdOutlineExpandMore size={'22px'} />,
        text: 'More',
        to:'#'
    },
]

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className='w-[15%] bg-white border-r border-gray-100'>
            <div className='p-4'>
                <button 
                    onClick={() => dispatch(setOpen(true))} 
                    className='
                        flex items-center gap-3 bg-[#C2E7FF] text-gray-800
                        px-6 py-3.5 rounded-2xl hover:shadow-md transition-all duration-200
                        w-[90%] justify-center font-medium text-[15px]
                    '
                >
                    <LuPencil size={'22px'} />
                    Compose
                </button>
            </div>
            <div className='text-gray-700'>
                {sidebarItems.map((item, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(item.to)}
                            className='
                                flex items-center pl-6 py-2.5 gap-4 my-1 cursor-pointer
                                transition-all duration-200 relative mx-2 rounded-xl
                                hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50
                                hover:shadow-sm hover:scale-[1.02]
                                text-gray-700
                            '
                        >
                            {/* Icon */}
                            <div className='
                                p-1.5 rounded-lg transition-colors duration-200
                                group-hover:bg-gray-100
                            '>
                                {item.icon}
                            </div>

                            {/* Text */}
                            <p className="text-[15px]">
                                {item.text}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar
