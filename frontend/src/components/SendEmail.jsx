// import React, { useState } from 'react'
// import { RxCross2 } from 'react-icons/rx'
// import { useSelector, useDispatch } from 'react-redux'
// import { setSentEmails, setOpen } from '../redux/appSlice'
// import { toast } from 'react-hot-toast'
// import axios from 'axios'

// const SendEmail = () => {
//   const { open ,sentEmails} = useSelector(store => store.app) //open value destruct ho gyi
//   const dispatch = useDispatch()

//   const [formData, setFormData] = useState({
//     to: '',
//     subject: '',
//     message: ''
//   })

//   const changeHandler = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:8080/api/v1/email/create', formData,
//         {
//           Headers: {
//             'Content-Type': 'application/json'
//           },
//           withCredentials: true
//         }
//       )
//       // console.log(res.data)
//       toast.success(res.data.message)
//       dispatch(setSentEmails([...sentEmails,res.data.email]))
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message)
//     }
//     dispatch(setOpen(false));
//   }


//   return (
//     <div className={` ${open ? 'block' : 'hidden'} bg-white max-w-6xl shadow-xl shadow-slate-600 rounded-t-md`}>
//       <div className='flex items-center justify-between px-3 py-2 bg-[#F2F6FC]'>
//         <h1>New Message</h1>
//         <div onClick={() => dispatch(setOpen(false))} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
//           <RxCross2 size={'20px'} />
//         </div>
//       </div>
//       <form onSubmit={submitHandler} className='flex flex-col p-3 gap-2'>
//         <input onChange={changeHandler} value={formData.to} name='to' type='text' placeholder='To' className='outline-none py-1' />
//         <input onChange={changeHandler} value={formData.subject} name='subject' type='text' placeholder='Subject' className='outline-none py-1' />
//         <textarea onChange={changeHandler} value={formData.message} name='message' rows={10} cols={30} className='outline-none py-1'></textarea>
//         <button type='submit' className='text-white bg-blue-600 rounded-full px-5 py-1 w-fit'>Send</button>
//       </form>
//     </div>
//   )
// }

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className={` ${open ? 'block' : 'hidden'} bg-white max-w-6xl shadow-xl shadow-slate-600 rounded-t-md`}>
      {/* Header */}
      <div className='flex items-center justify-between px-3 py-2 bg-[#F2F6FC]'>
        <h1>New Message</h1>
        <div onClick={() => dispatch(setOpen(false))} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
          <RxCross2 size={'20px'} />
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={submitHandler} className='flex flex-col p-3 gap-2'>
        <input
          onChange={changeHandler}
          value={formData.to}
          name='to'
          type='email'
          placeholder='To'
          className='outline-none py-1 border-b border-gray-300'
          required
        />

        <input
          onChange={changeHandler}
          value={formData.subject}
          name='subject'
          type='text'
          placeholder='Subject'
          className='outline-none py-1 border-b border-gray-300'
          required
        />

        <textarea
          onChange={changeHandler}
          value={formData.message}
          name='message'
          rows={10}
          cols={30}
          placeholder='Write your message here...'
          className='outline-none py-1 border-b border-gray-300'
          required
        />

        {/* Scheduled Email Field */}
        <label className='text-gray-600 text-sm'>Schedule Email (Optional)</label>
        <input
          onChange={changeHandler}
          value={formData.scheduledAt}
          name='scheduledAt'
          type='datetime-local'
          className='outline-none py-1 border-b border-gray-300'
        />

        <button type='submit' className='text-white bg-blue-600 rounded-full px-5 py-1 w-fit'>Send</button>
      </form>
    </div>
  );
};

export default SendEmail;
