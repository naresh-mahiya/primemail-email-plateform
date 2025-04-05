// export default SendEmail

import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useSelector, useDispatch } from 'react-redux';
import { setSentEmails, setOpen } from '../redux/appSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SendEmail = () => {
  const { open, sentEmails } = useSelector(store => store.app);
  const dispatch = useDispatch();

  // Form state with scheduledAt field
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    scheduledAt: '' // New field for scheduling emails
  });

  // Handle input change
  const changeHandler = (e) => {
    if (e.target.name === 'to') {
      // Split the input by commas and trim each email
      const emails = e.target.value.split(',').map(email => email.trim());
      setFormData({ ...formData, [e.target.name]: emails });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/v1/email/create', formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      toast.success(res.data.message);
      dispatch(setSentEmails([...sentEmails, res.data.email]));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    dispatch(setOpen(false));
  };

  return (
    // <div className={` ${open ? 'block' : 'hidden'} bg-white max-w-6xl shadow-xl shadow-slate-600 rounded-t-md`}>
    <div className={` ${open ? 'block' : 'hidden'} bg-[#F8FBFF] max-w-6xl shadow-xl shadow-slate-600 rounded-t-md mb-2`}>

      {/* Header */}
      <div className='flex items-center justify-between px-3 py-2 bg-[#F2F6FC]'>
        <h1>New Message</h1>
        <div onClick={() => dispatch(setOpen(false))} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
          <RxCross2 size={'20px'} />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className='p-4'>
        <div className='flex flex-col gap-4'>
          <div>
            <input
              type="text"
              name="to"
              placeholder='To (separate multiple emails with commas)'
              className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={Array.isArray(formData.to) ? formData.to.join(', ') : formData.to}
              onChange={changeHandler}
            />
            <p className='text-xs text-gray-500 mt-1'>Enter multiple email addresses separated by commas</p>
          </div>
          <input
            type="text"
            name="subject"
            placeholder='Subject'
            className='w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.subject}
            onChange={changeHandler}
          />
          <textarea
            name="message"
            placeholder='Message'
            className='w-full h-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.message}
            onChange={changeHandler}
          />
          <div className='flex items-center gap-2'>
            <input
              type="datetime-local"
              name="scheduledAt"
              className='p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={formData.scheduledAt}
              onChange={changeHandler}
            />
            <button
              type="submit"
              className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SendEmail;
