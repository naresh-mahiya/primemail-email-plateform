import React, { useState, useEffect } from 'react'
import { IoMdArrowBack, IoMdMore } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom'
import { BiArchiveIn } from "react-icons/bi";
import { FaReply } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineMarkEmailUnread, MdOutlineWatchLater, MdDeleteOutline, MdOutlineAddTask, MdOutlineReportGmailerrorred, MdOutlineDriveFileMove, MdOutlineMore } from "react-icons/md";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast'
import axios from 'axios'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const InboxMail = () => {
  const navigate = useNavigate();
  const { selectedEmail } = useSelector(store => store.app)
  const params = useParams();
  const [showReply, setShowReply] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [showQuotedText, setShowQuotedText] = useState(false);
  const [emailThread, setEmailThread] = useState([]);

  // Fetch email thread when component mounts or selectedEmail changes
  useEffect(() => {
    const fetchEmailThread = async () => {
      if (selectedEmail?.threadId) {
        try {
          const res = await axios.get(`http://localhost:8080/api/v1/email/thread/${selectedEmail.threadId}`, 
            { withCredentials: true }
          );
          setEmailThread(res.data.thread);
        } catch (error) {
          console.error('Error fetching thread:', error);
        }
      }
    };
    fetchEmailThread();
  }, [selectedEmail]);

  //delete email handler
  const deleteHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/v1/email/delete/${params.id}`, { withCredentials: true })
      toast.success(res.data.message)
      navigate('/');
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  //handle submit reply
  const handleSubmitReply = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/v1/email/reply/${params.id}`, 
        { message: replyMessage },
        { withCredentials: true }
      )
      toast.success('Reply sent successfully');
      setShowReply(false);
      setReplyMessage('');
      // Refresh the thread after sending reply
      const threadRes = await axios.get(`http://localhost:8080/api/v1/email/thread/${selectedEmail.threadId}`, 
        { withCredentials: true }
      );
      setEmailThread(threadRes.data.thread);
    } catch (error) {
      console.log("error from handleReplyEmail=>", error);
      toast.error(error.response?.data?.message || 'Failed to send reply');
    }
  }

  const formatQuotedText = (email) => {
    const date = new Date(email.createdAt).toLocaleString();
    return `On ${date}, ${email.senderId.fullname} wrote:\n\n${email.message}`;
  }

  return (
    <div className='flex-1 bg-white rounded-xl mx-5'>
      <div className='flex items-center justify-between px-4'>
        <div className='flex items-center gap-2 text-gray-700 py-2'>
          <div onClick={() => navigate('/')} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <IoMdArrowBack size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <BiArchiveIn size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <MdOutlineReportGmailerrorred size={'20px'} />
          </div>
          <div onClick={deleteHandler} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <MdDeleteOutline size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <MdOutlineMarkEmailUnread size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <MdOutlineWatchLater size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <MdOutlineAddTask size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <MdOutlineDriveFileMove size={'20px'} />
          </div>
          <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <IoMdMore size={'20px'} />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span>1 to 50</span>
          <MdKeyboardArrowLeft size={'24px'} />
          <MdKeyboardArrowRight size={'24px'} />
        </div>
      </div>
      <div className='h-[90vh] overflow-y-auto p-4'>
        {/* Email Subject */}
        <div className='flex justify-between bg-white items-center gap-1 mb-4'>
          <div className='flex items-center gap-2'>
            <h1 className='text-xl font-medium'>{selectedEmail?.subject}</h1>
            <span className='text-sm bg-gray-200 rounded-md px-2'>inbox</span>
          </div>
        </div>

        {/* Email Thread */}
        <div className="email-thread space-y-4">
          {emailThread.map((email, index) => (
            <div 
              key={email._id} 
              className={`email-message p-4 rounded-lg ${
                index === emailThread.length - 1 ? 'bg-gray-50 border border-gray-200' : 'bg-white'
              }`}
            >
              <div className="email-header flex justify-between items-center mb-2">
                <div className="text-sm text-gray-600">
                  {email.isReply ? (
                    <span className="font-medium">To: {email.receiverIds.map(receiver => receiver.fullname).join(', ')}</span>
                  ) : (
                    <span className="font-medium">From: {email.senderId.fullname}</span>
                  )}
                  <span className="text-gray-400 ml-2">
                    &lt;{email.isReply ? email.receiverIds[0].email : email.senderId.email}&gt;
                  </span>
                  {!email.isReply && email.receiverIds.length > 1 && (
                    <div className="mt-1 text-sm text-gray-500">
                      To: {email.receiverIds.map(receiver => receiver.fullname).join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div onClick={() => setShowReply(!showReply)} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                    <FaReply size={'15px'} />
                  </div>
                  <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                    <TiArrowForward size={'23px'} />
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(email.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="email-content whitespace-pre-wrap">
                {email.isReply ? (
                  <div>
                    <div className="mb-4">{email.message}</div>
                    <div className="border-t pt-4">
                      <div 
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                        onClick={() => setShowQuotedText(!showQuotedText)}
                      >
                        {showQuotedText ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        <span>Quoted text</span>
                      </div>
                      {showQuotedText && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-500 mb-2">---------- Forwarded message ----------</div>
                          <div className="text-sm text-gray-600">
                            <div>From: {email.parentEmailId?.senderId?.fullname || 'Unknown'} &lt;{email.parentEmailId?.senderId?.email || 'unknown'}&gt;</div>
                            <div>Date: {new Date(email.parentEmailId?.createdAt).toLocaleString()}</div>
                            <div>Subject: {email.parentEmailId?.subject}</div>
                            <div className="mt-2 whitespace-pre-wrap">{email.parentEmailId?.message}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  email.message
                )}
              </div>
              {index < emailThread.length - 1 && (
                <hr className="my-4 border-t border-dashed border-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Reply Composer */}
        {showReply && (
          <div className='mt-8 border rounded-lg p-4'>
            <div className='mb-4'>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>To: </span>
                {selectedEmail.senderId.fullname} &lt;{selectedEmail.senderId.email}&gt;
              </div>
              <div className='text-sm text-gray-600'>
                <span className='font-medium'>Subject: </span>
                Re: {selectedEmail.subject}
              </div>
            </div>
            
            <textarea
              className='w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Add a message (optional)'
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />

            <div className='flex justify-end gap-2 mt-4'>
              <button
                className='px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg'
                onClick={() => {
                  setShowReply(false);
                  setReplyMessage('');
                }}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                onClick={handleSubmitReply}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InboxMail


