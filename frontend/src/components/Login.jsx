import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/appSlice.js'
import { MdEmail, MdLock } from 'react-icons/md'

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/v1/user/login',
                input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
            )
            console.log(res.data)
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAuthUser(res.data.user));
                navigate('/')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className='flex items-center justify-center w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <div className='bg-white p-8 rounded-2xl shadow-xl w-[400px]'>
                <div className='text-center mb-8'>
                    <img className="w-16 h-16 mx-auto mb-4" src="/emailLogo.png" alt="PrimeMail Logo" />
                    <h1 className='font-bold text-3xl text-gray-800 mb-2'>Welcome Back</h1>
                    <p className='text-gray-600'>Sign in to your PrimeMail account</p>
                </div>

                <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <MdEmail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            onChange={changeHandler} 
                            value={input.email} 
                            name='email' 
                            type='email' 
                            placeholder='Email Address' 
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        />
                    </div>

                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <MdLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            onChange={changeHandler} 
                            value={input.password} 
                            name='password' 
                            type='password' 
                            placeholder='Password' 
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        />
                    </div>

                    <button 
                        type='submit' 
                        className='w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mt-4'
                    >
                        Sign In
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-600'>
                        Don't have an account?{' '}
                        <Link to={'/signup'} className='text-blue-600 hover:text-blue-800 font-semibold hover:underline'>
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
