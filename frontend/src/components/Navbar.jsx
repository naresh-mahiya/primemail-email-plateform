import React, { useState, useEffect, useRef, useCallback } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { GoSearch } from "react-icons/go";
import { CiCircleQuestion } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { PiDotsNineBold } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setSearchText } from '../redux/appSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user } = useSelector(store => store.app)
    const [text, setText] = useState('')
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const profileMenuRef = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClickOutside = useCallback((event) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
            setShowProfileMenu(false);
        }
    }, []);

    useEffect(() => {
        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu, handleClickOutside]);

    const handleShowProfileMenu = () => {
        setShowProfileMenu(prev => !prev);
    }

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/user/logout');
            toast.success(res.data.message)
            dispatch(setAuthUser(null));
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        dispatch(setSearchText(text));
    }, [text]);

    return (
        <div className='flex items-center justify-between mx-3 h-20'>
            <div className='flex items-center gap-10'>
                <div className='flex item-center gap-2'>
                    <div className='p-3 hover:bg-gray-200 rounded-full'>
                        <RxHamburgerMenu />
                    </div>
                    {/* <img className='w-8' src='https://static.vecteezy.com/system/resources/previews/013/948/544/non_2x/gmail-logo-on-transparent-white-background-free-vector.jpg' alt='logo' /> */}
                    {/* <h1 className='text-2xl text-grey-500 font-medium'>GloMail</h1> */}

                    <img className="w-10 h-10 rounded-xl" src="/emailLogo.png" alt="GloMail Logo" />
                    <h1 className="text-3xl font-bold text-gray-700 tracking-wide drop-shadow-md">
                        Prime<span className="text-blue-500">Mail</span>
                    </h1>

                </div>
            </div>

            {
                user &&
                <>
                    <div className='w-[50%] mr-60'>
                        <div className='flex items-center bg-[#EAF1FB] px-2 py-3.5 rounded-full'>
                            <GoSearch size={'20px'} className='text-gray-700' />

                            <input onChange={(e) => setText(e.target.value)} value={text} type='text' placeholder='search mail'
                                className='rounded-full w-full bg-transparent outline-none px-1' />
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='p-2.5 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <CiCircleQuestion size={'24px'} />
                        </div>
                        <div className='p-2.5 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <IoSettingsOutline size={'24px'} />
                        </div>
                        <div className='p-2.5 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <PiDotsNineBold size={'24px'} />
                        </div>
                        <div className="relative" ref={profileMenuRef}>
                            <Avatar
                                src={user.profilePhoto}
                                size="40"
                                round={true}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={handleShowProfileMenu}
                            />

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={user.profilePhoto} size="40" round={true} />
                                            <div>
                                                <p className="font-medium text-gray-900">{user.fullname}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logoutHandler}
                                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <IoLogOutOutline size={20} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            }



        </div>
    )
}

export default Navbar
