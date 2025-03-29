import React, { useState, useEffect } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { GoSearch } from "react-icons/go";
import { CiCircleQuestion } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { PiDotsNineBold } from "react-icons/pi";
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setSearchText } from '../redux/appSlice'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {

    const { user } = useSelector(store => store.app)
    const [text, setText] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();

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



    //need suggestion on every key press for search mail..so useEffect
    useEffect(() => {
        dispatch(setSearchText(text));
    }, [text]);

    return (
        <div className='flex items-center justify-between mx-3 h-16'>
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
                        <div className='flex items-center bg-[#EAF1FB] px-2 py-3 rounded-full'>
                            <GoSearch size={'20px'} className='text-gray-700' />

                            <input onChange={(e) => setText(e.target.value)} value={text} type='text' placeholder='search mail'
                                className='rounded-full w-full bg-transparent outline-none px-1' />
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className=' p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <CiCircleQuestion size={'24px'} />
                        </div>
                        <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <IoSettingsOutline size={'24px'} />
                        </div>
                        <div className='p-2 rounded-full hover:bg-gray-200 cursor-pointer'>
                            <PiDotsNineBold size={'24px'} />
                        </div>
                        <span onClick={logoutHandler} className='underline cursor-pointer'>Logout</span>
                        <Avatar src={user.profilePhoto} size="40" round={true} />
                    </div>
                </>
            }



        </div>
    )
}

export default Navbar
