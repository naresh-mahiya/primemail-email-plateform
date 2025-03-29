import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import {useDispatch} from 'react-redux'
import {setAuthUser} from '../redux/appSlice.js'

const Login = () => {

    const navigate = useNavigate();
    const dispatch= useDispatch();

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
                navigate('/')
                toast.success(res.data.message);
                dispatch(setAuthUser(res.data.user));
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }


    return (
        <div className='flex items-center justify-center w-screen h-screen'>
            <form onSubmit={submitHandler} className='flex flex-col gap-3 bg-white p-4 w-[24%]'>
                <h1 className='font-bold text-2xl my-2'>Login</h1>
                <input onChange={changeHandler} value={input.email} name='email' type='email' placeholder='email' className='border border-gray-400 rounded-md px-2 py-1' />
                <input onChange={changeHandler} value={input.password} name='password' type='password' placeholder='password' className='border border-gray-400 rounded-md px-2 py-1' />
                <button type='submit' className='text-white my-2 bg-gray-800 p-2 rounded-md'>Login</button>
                <p>Don't have an acoount? <Link to={'/signup'} className='text-blue-600'>signup</Link></p>

            </form>
        </div>
    )
}

export default Login
