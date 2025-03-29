import React from 'react'
import { MdScheduleSend, MdDone, MdDoneAll, MdCropSquare, MdOutlineStarBorder } from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedEmail } from '../redux/appSlice'

const Email = ({ email }) => {

  const location = useLocation();
  const isInbox = location.pathname === '/'
  const isSent = location.pathname === '/sent'

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openMail = () => {
    dispatch(setSelectedEmail(email))
    if (isInbox)
      navigate(`/inbox/mail/${email._id}`);
    else
      navigate(`/sent/mail/${email._id}`)

  }



  return (
    <div onClick={openMail} className='flex items-center justify-between border-b border-gray-200 px-4 py-3 text-sm hover:cursor-pointer hover:shadow-md'>
      <div className='flex items-center gap-3'>
        <div className='text-gray-400'>
          <MdCropSquare size={'20px'} />
        </div>
        <div className='text-gray-400'>
          <MdOutlineStarBorder size={'20px'} />
        </div>
        <div>
          {
            isInbox ? (<h1 className='font-semibold'>{email.senderId.fullname}</h1>)
              : (<h1 className='font-semibold'>To {email.receiverId.fullname}</h1>)
          }

        </div>

        <div>
          <h1 className='font-semibold'>{email?.subject}</h1>
        </div>
      </div>
      <div className='flex-1 ml-4'>
        <p>{email?.message}</p>
      </div>
      <div>
        {
          isSent &&
          <p>
            {email?.read && <MdDoneAll className='text-blue-500' size={'20px'}/>} 
           
          </p>
        }

      </div>

      <div className="flex items-center gap-2 text-gray-600 pr-5">
        {email.status === "pending" && (
          <>
            <MdScheduleSend size={20} className="text-gray-500" />
            <p className="text-sm">{new Date(email?.scheduledAt)
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

      <div className='flex none text-gray text-sm'>
        <p>
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
