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

  return (
    <div 
      onClick={openMail} 
      className='
        flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm 
        hover:bg-blue-50/50 hover:shadow-md transition-all duration-200 cursor-pointer
        h-[48px] group mx-2 rounded-lg
      '
    >
      <div className='flex items-center gap-3 min-w-[200px]'>
        <div className='text-gray-400 hover:text-gray-600 transition-colors'>
          <MdCropSquare size={'20px'} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className='text-gray-400 hover:text-yellow-500 transition-colors'>
          <MdOutlineStarBorder size={'20px'} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className='min-w-[120px]'>
          {
            isInbox ? (
              <h1 className='font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors'>
                {email.senderId.fullname}
              </h1>
            ) : (
              <h1 className='font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors'>
                To {email.receiverId.fullname}
              </h1>
            )
          }
        </div>

        <div className='min-w-[200px]'>
          <h1 className='font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors'>
            {email?.subject}
          </h1>
        </div>
      </div>
      <div className='flex-1 ml-4 max-w-[400px]'>
        <p className='truncate text-gray-500 group-hover:text-gray-700 transition-colors'>
          {truncateMessage(email?.message)}
        </p>
      </div>
      <div className='flex items-center gap-2 min-w-[200px] justify-end'>
        {
          isSent &&
          <p className="text-blue-500">
            {email?.read && <MdDoneAll size={'20px'} className="group-hover:scale-110 transition-transform"/>} 
          </p>
        }

        {email.status === "pending" && (
          <>
            <MdScheduleSend size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            <p className="text-sm text-gray-500 truncate group-hover:text-gray-700 transition-colors">
              {new Date(email?.scheduledAt)
                .toLocaleString("en-GB", {
                  timeZone: "Asia/Kolkata",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })
                .replace(/\//g, "-")
                .replace(",", " ,")}
            </p>
          </>
        )}
      </div>

      <div className='flex-none text-gray-500 text-sm min-w-[120px] text-right group-hover:text-gray-700 transition-colors'>
        <p className='truncate'>
          {new Date(email?.createdAt)
            .toLocaleString("en-GB", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
            .replace(/\//g, "-")
            .replace(",", " ,")}
        </p>
      </div>
    </div>
  )
}

export default Email
