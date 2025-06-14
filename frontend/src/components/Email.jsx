import React, { useState, useEffect } from 'react'
import { MdScheduleSend, MdDone, MdDoneAll, MdCropSquare, MdOutlineStarBorder, MdStar } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedEmail } from '../redux/appSlice'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const Email = ({ email, onDelete, isSelected, onSelect }) => {
  const location = useLocation();
  const isInbox = location.pathname === '/'
  const isSent = location.pathname === '/sent'
  const isStarred = location.pathname === '/starred'
  const [isStarredStatus, setIsStarredStatus] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if email is starred
    const checkStarred = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/email/starred', { withCredentials: true });
        setIsStarredStatus(res.data.emails.some(e => e._id === email._id));
      } catch (error) {
        console.log("error from checkStarred=>", error);
      }
    };
    checkStarred();
  }, [email._id]);

  const handleStar = async (e) => {
    e.stopPropagation();
    try {
      if (isStarredStatus) {
        await axios.post(`http://localhost:8080/api/v1/email/unstar/${email._id}`, {}, { withCredentials: true });
        toast.success('Email unstarred');
      } else {
        await axios.post(`http://localhost:8080/api/v1/email/star/${email._id}`, {}, { withCredentials: true });
        toast.success('Email starred');
      }
      setIsStarredStatus(!isStarredStatus);
    } catch (error) {
      console.log("error from handleStar=>", error);
      toast.error('Failed to update star status');
    }
  };

  const truncateMessage = (message, maxLength = 100) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const openMail = () => {
    dispatch(setSelectedEmail(email))
    if (isStarred) {
      navigate(`/starred/mail/${email._id}`);
    } else if (isInbox) {
      navigate(`/inbox/mail/${email._id}`);
    } else {
      navigate(`/sent/mail/${email._id}`);
    }
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
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={() => onSelect(email._id)} 
          onClick={(e) => e.stopPropagation()} // Prevent openMail on checkbox click
        />
        {isStarredStatus ? (
          <MdStar 
            size={18} 
            className="text-yellow-400 cursor-pointer" 
            onClick={handleStar}
          />
        ) : (
          <MdOutlineStarBorder 
            size={18} 
            className="cursor-pointer" 
            onClick={handleStar}
          />
        )}
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
        ) : isSent? (
          // Show sent and read status in sent box
          email?.read ? (
            <MdDoneAll size={18} className='text-blue-500' />
          ) : (
            <MdDone size={18} className='text-gray-500' />
          )
        ):null }
        <span className='text-sm text-gray-500'>{new Date(email?.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default Email
