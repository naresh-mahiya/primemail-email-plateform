// export default SendEmail

import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useSelector, useDispatch } from 'react-redux';
import { setSentEmails, setOpen } from '../redux/appSlice';
import { toast } from 'react-hot-toast';
import api from '../api';
import { useEffect } from 'react';

const SendEmail = ({setShowAICompose, aiComposeText}) => {
  const { open, sentEmails } = useSelector(store => store.app);
  const dispatch = useDispatch();

  // Form state with scheduledAt field
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    scheduledAt: '', // New field for scheduling emails
    attachments: []
  });

  useEffect(() => {
    if (aiComposeText) {
      setFormData({ ...formData, message: aiComposeText });
    }
  }, [aiComposeText]);



  // Handle input change
  const changeHandler = (e) => {
    if (e.target.name === 'to') {
      // Split the input by commas and trim each email
      const emails = e.target.value.split(',').map(email => email.trim());
      setFormData({ ...formData, [e.target.name]: emails });
    } else if (e.target.name === 'attachments') {
      let files = Array.from(e.target.files);
      // allowed extensions
      const MAX_SIZE = 50 * 1024 * 1024; // 50MB
      const allowedExt = ['.jpg','.jpeg','.png','.pdf','.docx','.mp4','.mov','.webm','.avi'];
      const invalid = files.filter(f => !allowedExt.some(ext=>f.name.toLowerCase().endsWith(ext)));
      if(invalid.length){
        toast.error(`Some files have unsupported type and were ignored (${invalid.map(f=>f.name).join(', ')})`);
        files = files.filter(f => !invalid.includes(f));
      // size check
      const oversize = files.filter(f=> f.size > MAX_SIZE);
      if(oversize.length){
        toast.error(`${oversize.length} file(s) exceed 50MB and were ignored`);
        files = files.filter(f=> f.size <= MAX_SIZE);
      }
      }
      if (files.length > 10) {
        toast.error('You can attach up to 10 files');
        files = files.slice(0,10);
      }
      setFormData({ ...formData, attachments: files });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //need to use this class if want to send files to the backend (becose json.stringify will convert files into json object which will be of no use)
      //state can be used to store files and use for UI purposes...but when need to send to backend
      //.....need this formdata class
      const data = new FormData();
      if(Array.isArray(formData.to)) {
        formData.to.forEach(email=> data.append('to', email));
      } else {
        data.append('to', formData.to);
      }
      data.append('subject', formData.subject);
      data.append('message', formData.message);
      if(formData.scheduledAt) data.append('scheduledAt', formData.scheduledAt);
      formData.attachments.forEach(file => data.append('attachments', file));

      const res = await api.post('api/v1/email/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

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
        <div>
          <button onClick={()=>setShowAICompose(true)}>✨AI Compose</button>
        </div>
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
          <div>
            <input
              type="file"
              name="attachments"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.docx,.mp4,.mov,.webm,.avi"
              onChange={changeHandler}
            />
            {formData.attachments.length > 0 && (
              <p className='text-xs text-gray-500 mt-1'>Selected {formData.attachments.length} / 10 files</p>
            )}
          </div>
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
