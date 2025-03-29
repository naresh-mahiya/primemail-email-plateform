import React from 'react'
import { LuPencil } from "react-icons/lu";
import { MdInbox } from "react-icons/md";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlineWatchLater } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { MdOutlineDrafts } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { setOpen } from '../redux/appSlice.js'
import { useNavigate } from 'react-router-dom';



const sidebarItems = [
    {
        icon: <MdInbox size={'20px'} />,
        text: 'Inbox',
        to:'/'
    },
    {
        icon: <IoMdStarOutline size={'20px'} />,
        text: 'Starred',
        to:'/'
    },
    {
        icon: <MdOutlineWatchLater size={'20px'} />,
        text: 'Snoozed',
        to:'/'
    },
    {
        icon: <TbSend2 size={'20px'} />,
        text: 'Sent',
        to:'sent'
    },
    {
        icon: <MdOutlineDrafts size={'20px'} />,
        text: 'Drafts',
        to:'/'
    },
    {
        icon: <MdOutlineExpandMore size={'20px'} />,
        text: 'More',
        to:'/'
    },
]


const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return (
        <div className='w-[15%]'>
            <div className='p-3'>
                <button onClick={() => dispatch(setOpen(true))} className='flex items-center gap-2 bg-[#C2E7FF] p-4 rounded-2xl hover:shadow'>
                    <LuPencil size={'24px'} />
                    Compose
                </button>

            </div>
            <div className='text-gray-700'>
                {
                    sidebarItems.map((item, index) => {
                        return (
                            <div onClick={() => navigate(item.to) } key={index} className='flex items-center pl-6 py-1 rounded-r-full gap-4 my-2 hover:cursor-pointer hover:bg-gray-200'>
                                {item.icon}
                                <p>{item.text}</p>
                            </div>
                        )
                    })
                }



            </div>
        </div>
    )
}

export default Sidebar
