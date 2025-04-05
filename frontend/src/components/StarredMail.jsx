import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Email from './Email';
import { IoMdArrowBack } from "react-icons/io";
import { BiArchiveIn } from "react-icons/bi";
import { MdOutlineReportGmailerrorred, MdDeleteOutline, MdOutlineMarkEmailUnread, MdOutlineWatchLater, MdOutlineAddTask, MdOutlineDriveFileMove, MdOutlineMore } from "react-icons/md";

const StarredMail = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [emailThread, setEmailThread] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            fetchEmailThread(params.id);
        } else {
            fetchStarredEmails();
        }
    }, [params.id]);

    const fetchStarredEmails = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/email/starred', { withCredentials: true });
            setEmails(res.data.emails);
        } catch (error) {
            console.log("error from fetchStarredEmails=>", error);
            toast.error('Failed to fetch starred emails');
        }
    };

    const fetchEmailThread = async (emailId) => {
        try {
            // First get the email to get its threadId
            const emailRes = await axios.get(`http://localhost:8080/api/v1/email/${emailId}`, { withCredentials: true });
            const email = emailRes.data.email;
            
            if (!email || !email.threadId) {
                throw new Error('Email or threadId not found');
            }

            // Then fetch the thread using the threadId
            const threadRes = await axios.get(`http://localhost:8080/api/v1/email/thread/${email.threadId}`, { withCredentials: true });
            setSelectedEmail(email);
            setEmailThread(threadRes.data.thread);
        } catch (error) {
            console.log("error from fetchEmailThread=>", error);
            toast.error('Failed to fetch email thread');
        }
    };

    const handleEmailClick = (email) => {
        navigate(`/starred/mail/${email._id}`);
    };

    return (
        <div className='flex-1 bg-white rounded-xl mx-5'>
            <div className='flex items-center justify-between px-4'>
                <div className='flex items-center gap-2 text-gray-700 py-2'>
                    <div onClick={() => navigate('/starred')} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <IoMdArrowBack size={'20px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <BiArchiveIn size={'20px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <MdOutlineReportGmailerrorred size={'20px'} />
                    </div>
                    <div className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
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
                        <MdOutlineMore size={'20px'} />
                    </div>
                </div>
            </div>
            <div className='h-[90vh] overflow-y-auto'>
                {params.id ? (
                    // Email Thread View
                    <div className='p-4'>
                        {emailThread.length > 0 && (
                            <div>
                                {emailThread.map((email, index) => (
                                    <div key={email._id} className={`mb-4 ${index === emailThread.length - 1 ? 'bg-gray-50 p-4 rounded-lg' : ''}`}>
                                        <div className='mb-4'>
                                            <h2 className='text-xl font-semibold'>{email.subject}</h2>
                                            <div className='text-sm text-gray-600 mt-2'>
                                                <div>
                                                    From: {email.senderId?.fullname || 'Unknown'} &lt;{email.senderId?.email || 'unknown'}&gt;
                                                </div>
                                                <div>
                                                    To: {email.receiverIds?.map(receiver => 
                                                        `${receiver?.fullname || 'Unknown'} <${receiver?.email || 'unknown'}>`
                                                    ).join(', ')}
                                                </div>
                                                <div className='text-gray-400'>
                                                    {new Date(email.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='whitespace-pre-wrap'>{email.message}</div>
                                        {index < emailThread.length - 1 && (
                                            <hr className="my-4 border-t border-dashed border-gray-200" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Email List View
                    <div>
                        {emails.map((email) => (
                            <Email 
                                key={email._id} 
                                email={email} 
                                onClick={() => handleEmailClick(email)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StarredMail; 