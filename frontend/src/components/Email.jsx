import React from 'react'
import { MdScheduleSend, MdDone, MdDoneAll, MdCropSquare, MdOutlineStarBorder, MdOutlineStar } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedEmail } from '../redux/appSlice'

const Email = ({ email }) => {
  const location = useLocation();
  const isInbox = location.pathname === '/'
  const isSent = location.pathname === '/sent'

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const openMail = () => {
    dispatch(setSelectedEmail(email))
    if (isInbox)
      navigate(`/inbox/mail/${email._id}`);
    else
      navigate(`/sent/mail/${email._id}`)
  }

  // Helper function to get recipient names
  const getRecipientNames = () => {
    if (!email?.receiverIds || !Array.isArray(email.receiverIds)) {
      return email?.receiverId?.fullname || 'Unknown';
    }
    return email.receiverIds.map(receiver => receiver?.fullname || 'Unknown').join(', ');
  };

  return (
    <div 
      onClick={openMail} 
      className='flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-100 hover:cursor-pointer'
    >
      <div className='flex items-center gap-2 w-1/4'>
        <MdCropSquare size={18} />
        <MdOutlineStarBorder size={18} />
        {isInbox ? (
          <span className='font-medium'>{email?.senderId?.fullname || 'Unknown'}</span>
        ) : (
          <span className='font-medium'>{getRecipientNames()}</span>
        )}
      </div>
      <div className='w-3/4'>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>{email?.subject || 'No Subject'}</span>
          <span className='text-gray-500 text-sm truncate'>{truncateMessage(email?.message)}</span>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        {email?.status === 'pending' ? (
          <MdScheduleSend size={18} className='text-gray-500' />
        ) : isInbox ? (
          email?.read ? (
            <MdDoneAll size={18} className='text-blue-500' />
          ) : (
            <MdDone size={18} className='text-gray-500' />
          )
        ) : (
          <MdDoneAll size={18} className='text-blue-500' />
        )}
        <span className='text-sm text-gray-500'>{new Date(email?.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default Email
