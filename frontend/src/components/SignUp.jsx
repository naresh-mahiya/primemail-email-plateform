import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { MdEmail, MdLock, MdPerson } from 'react-icons/md'

const SignUp = () => {
    const navigate = useNavigate();

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        password: ""
    })

    const [emailError, setEmailError] = useState("")

    const validateEmail = (emailaddress) => {
        // Must start with a letter and only contain letters and numbers
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9]*$/
        return emailRegex.test(emailaddress)
    }

    const changeHandler = (e) => {
        const { name, value } = e.target
        if (name === 'email') {
            // Remove any @ or domain part if user tries to enter it
            const cleanValue = value.split('@')[0]
            if (cleanValue === '' || validateEmail(cleanValue)) {
                setInput({ ...input, [name]: cleanValue })
                setEmailError("")
            } else {
                if (cleanValue.length === 0) {
                    setEmailError("Email cannot be empty")
                } else if (!/^[a-zA-Z]/.test(cleanValue)) {
                    setEmailError("Email must start with a letter")
                } else {
                    setEmailError("Only letters and numbers are allowed")
                }
            }
        } else {
            setInput({ ...input, [name]: value })
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (emailError) {
            toast.error("invalid email format");
            return
        }

        try {
            const res = await axios.post('http://localhost:8080/api/v1/user/register',
                {
                    ...input,
                    email: `${input.email}@primemail.com`
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(res.data)
            if (res.data.success) {
                navigate('/login')
                toast.success(res.data.message);
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
                    <h1 className='font-bold text-3xl text-gray-800 mb-2'>Create Account</h1>
                    <p className='text-gray-600'>Join PrimeMail today</p>
                </div>

                <form onSubmit={submitHandler} className='flex flex-col gap-4'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <MdPerson className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                            onChange={changeHandler} 
                            value={input.fullname} 
                            name='fullname' 
                            type='text' 
                            placeholder='Full Name' 
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                        />
                    </div>

                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <MdEmail className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className='relative'>
                            <input 
                                onChange={changeHandler} 
                                value={input.email} 
                                name='email' 
                                type='text' 
                                placeholder='username' 
                                className='w-full pl-10 pr-[120px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' 
                            />
                            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'>@primemail.com</span>
                        </div>
                        {emailError && (
                            <p className='absolute -bottom-6 left-0 text-red-500 text-sm'>{emailError}</p>
                        )}
                    </div>

                    <div className={`relative ${emailError ? 'mt-8' : ''}`}>
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
                        Create Account
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-gray-600'>
                        Already have an account?{' '}
                        <Link to={'/login'} className='text-blue-600 hover:text-blue-800 font-semibold hover:underline'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
