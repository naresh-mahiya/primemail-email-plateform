import React from 'react'
import { IoMdArrowBack, IoMdMore } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom'
import { BiArchiveIn } from "react-icons/bi";
import { MdDoneAll, MdScheduleSend, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineMarkEmailUnread, MdOutlineWatchLater, MdDeleteOutline, MdOutlineAddTask, MdOutlineReportGmailerrorred, MdOutlineDriveFileMove, MdOutlineMore } from "react-icons/md";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast'
import axios from 'axios'



const SentMail = () => {
    const navigate = useNavigate();
    const { selectedEmail } = useSelector(store => store.app)
    const params = useParams();
    const { user } = useSelector(store => store.app)

    const deleteHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/v1/email/${params.id}`, { withCredentials: true })
            toast.success(res.data.message)
            navigate('/sent');
        } catch (error) {
            console.log(error)
        }
    }





    return (
        <div className='flex-1 bg-white rounded-xl mx-5'>
            <div className='flex items-center justify-between px-4'>
                <div className='flex items-center gap-2 text-gray-700 py-2'>
                    <div onClick={() => navigate('/sent')} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
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
                <div className='flex justify-between bg-white items-center gap-1'>
                    <div className='flex items-center gap-2'>
                        <h1 className='text-xl font-medium'>{selectedEmail?.subject}</h1>
                        <span className='text-sm bg-gray-200 rounded-md px-2'>sentbox</span>
                        <span>
                            {selectedEmail?.read && <MdDoneAll className='text-blue-500' size={'20px'} />}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <div className="flex items-center gap-2 text-gray-600 pr-5">
                            {selectedEmail.status === "pending" && (
                                <>
                                    <MdScheduleSend size={20} className="text-gray-500" />
                                    <p className="text-sm">{new Date(selectedEmail?.scheduledAt)
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
                        <div className='flex-none text-gray-400 my-5 text-sm'>
                            <p>{new Date(selectedEmail.createdAt)
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
                                .replace(",", " ,")}</p>
                        </div>
                    </div>
                </div>
                <div className=' text-sm'>
                    <h3 className='font-bold'>{user.fullname.toUpperCase()}</h3>
                    <h1 className='text-gray-500'>To {selectedEmail.receiverId.fullname} &lt;{selectedEmail.to}&gt;</h1>
                </div>
                <div className='my-10'>
                    <p>{selectedEmail?.message}</p>
                </div>

            </div>

        </div>
    )
}

export default SentMail
