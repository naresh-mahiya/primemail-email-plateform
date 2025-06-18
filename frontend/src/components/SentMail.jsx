import React, { useState, useEffect } from 'react'
import { IoMdArrowBack, IoMdMore } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom'
import { BiArchiveIn } from "react-icons/bi";
import { FaReply } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineMarkEmailUnread, MdOutlineWatchLater, MdDeleteOutline, MdOutlineAddTask, MdOutlineReportGmailerrorred, MdOutlineDriveFileMove, MdOutlineMore } from "react-icons/md";
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast'
import api from '../api'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri";
import { FiPaperclip } from "react-icons/fi";
import { handleAttachmentFiles } from '../utils/handleAttachmentFiles';
import  AttachmentButton  from './AttachmentButton'

const SentMail = () => {
    const navigate = useNavigate();
    const { selectedEmail } = useSelector(store => store.app)
    const params = useParams();
    const [showReply, setShowReply] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [showQuotedText, setShowQuotedText] = useState(false);
    const [emailThread, setEmailThread] = useState([]);
    const [showOriginal, setShowOriginal] = useState(true);
    const [showForward, setShowForward] = useState(false);
    const [forwardTo, setForwardTo] = useState('');
    const [forwardMessage, setForwardMessage] = useState('');
    const [forwardAttachments, setForwardAttachments] = useState([]);
    const [replyAttachments, setReplyAttachments] = useState([]);
    const [readReceipt, setReadReceipt] = useState(false);
    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);

    useEffect(() => {
        const fetchEmailThread = async () => {
            if (selectedEmail) {
                try {
                    if (selectedEmail.threadId) {
                        const res = await api.get(`api/v1/email/thread/${selectedEmail.threadId}`,
                            { withCredentials: true }
                        );
                        setEmailThread(res.data.thread);
                        setReadReceipt(res.data.readReceipt);
                    } else {
                        setEmailThread([selectedEmail]);
                    }
                } catch (error) {
                    console.error('Error fetching thread:', error);
                    setEmailThread([selectedEmail]);
                }
            }
        };
        fetchEmailThread();
    }, [selectedEmail]);

    // Generate AI summary of email
    const handleSummarize = async () => {
        if (!selectedEmail) return;
        try {
            setLoadingSummary(true);
            setSummary('');
            const res = await api.post('api/v1/ai/summarize', {
                subject: selectedEmail.subject,
                message: selectedEmail.message,
            }, { withCredentials: true });
            setSummary(res.data.summary);
        } catch (error) {
            console.error('Error summarizing email:', error);
            toast.error(error.response?.data?.message || 'Failed to generate summary');
        } finally {
            setLoadingSummary(false);
        }
    };

    const renderReadReceipt = () => {
        return readReceipt ? <span className="text-green-500">✔ Read</span> : <span className="text-gray-500">✖ Unread</span>;
    };

    //delete email handler
    const deleteHandler = async () => {
        try {
            const res = await api.delete(`api/v1/email/delete/${params.id}`, { withCredentials: true })
            toast.success(res.data.message)
            navigate('/sent');
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    // Handle file selection for reply
    const handleReplyFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const updated = handleAttachmentFiles({
            newFiles,
            existingFiles: replyAttachments
        });
        setReplyAttachments(updated);
    };

    //handle submit reply
    const handleSubmitReply = async () => {
        try {
            const formData = new FormData();
            formData.append('message', replyMessage);

            // Append all attachments
            replyAttachments.forEach(file => {
                formData.append('attachments', file);
            });

            const res = await api.post(`api/v1/email/reply/${params.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            )

            toast.success('Reply sent successfully');
            setShowReply(false);
            setReplyMessage('');
            setReplyAttachments([]);

            // Refresh the thread after sending reply
            const threadRes = await api.get(`api/v1/email/thread/${selectedEmail.threadId}`,
                { withCredentials: true }
            );
            setEmailThread(threadRes.data.thread);
        } catch (error) {
            console.log("error from handleReplyEmail=>", error);
            toast.error(error.response?.data?.message || 'Failed to send reply');
        }
    }

    // Handle file selection for forward
    const handleForwardFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const updated = handleAttachmentFiles({
            newFiles,
            existingFiles: forwardAttachments
        });
        setForwardAttachments(updated);
    };

    //handle forward email
    const handleForwardEmail = async () => {
        try {
            const forwardedContent = `${forwardMessage}\n\n---------- Forwarded message ----------\nFrom: ${selectedEmail.senderId.fullname} <${selectedEmail.senderId.email}>\nDate: ${new Date(selectedEmail.createdAt).toLocaleString()}\nSubject: ${selectedEmail.subject}\nTo: ${selectedEmail.receiverIds.map(receiver => `${receiver.fullname} <${receiver.email}>`).join(', ')}\n\n${selectedEmail.message}`;

            const formData = new FormData();
            formData.append('message', forwardedContent);

            // Add each recipient
            forwardTo.split(',').forEach(email => {
                formData.append('to', email.trim());
            });

            // Append all attachments
            forwardAttachments.forEach(file => {
                formData.append('attachments', file);
            });

            const res = await api.post(`api/v1/email/forward/${params.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            )

            toast.success('Email forwarded successfully');
            setShowForward(false);
            setForwardTo('');
            setForwardMessage('');
            setForwardAttachments([]);
        } catch (error) {
            console.log("error from handleForwardEmail=>", error);
            toast.error(error.response?.data?.message || 'Failed to forward email');
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
                {/* Email Subject */}
                <div className='flex justify-between bg-white items-center gap-1 mb-4'>
                    <div className='flex items-center gap-2'>
                        <h1 className='text-xl font-medium'>{selectedEmail?.subject}</h1>
                        <span className='text-sm bg-gray-200 rounded-md px-2'>sent</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setShowOriginal(!showOriginal)}
                            className='text-sm text-gray-600 hover:text-gray-800'
                        >
                            {showOriginal ? 'Hide Original' : 'Show Original'}
                        </button>
                        <button
                            onClick={handleSummarize}
                            className='flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                        >
                            <RiRobot2Line size={16} /> Summarize
                        </button>
                    </div>
                </div>

                {loadingSummary && (
                    <p className='italic text-gray-500 mb-4'>Generating summary...</p>
                )}
                {summary && !loadingSummary && (
                    <div className='bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-md mb-4'>
                        <h2 className='font-medium text-indigo-700 mb-1'>AI Summary</h2>
                        <p className='whitespace-pre-wrap'>{summary}</p>
                    </div>
                )}
                {/* Email Thread */}
                <div className="email-thread space-y-4">
                    {emailThread.map((email, index) => (
                        <div
                            key={email._id}
                            className={`email-message p-4 rounded-lg ${index === emailThread.length - 1 ? 'bg-gray-50 border border-gray-200' : 'bg-white'
                                }`}
                        >
                            <div className="email-header flex justify-between items-center mb-2">
                                <div className="text-sm text-gray-600">
                                    {email.isReply ? (
                                        <span className="font-medium">To: {email.receiverIds.map(receiver => receiver.fullname).join(', ')}</span>
                                    ) : (
                                        <span className="font-medium">To: {email.receiverIds.map(receiver => receiver.fullname).join(', ')}</span>
                                    )}
                                    <span className="text-gray-400 ml-2">
                                        &lt;{email.receiverIds[0].email}&gt;
                                    </span>
                                    {email.receiverIds.length > 1 && (
                                        <div className="mt-1 text-sm text-gray-500">
                                            {email.receiverIds.slice(1).map(receiver => (
                                                <div key={receiver._id}>
                                                    &lt;{receiver.email}&gt;
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div onClick={() => setShowReply(!showReply)} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                                        <FaReply size={'15px'} />
                                    </div>
                                    <div onClick={() => setShowForward(true)} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
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
                                        <div className="mb-4 whitespace-pre-wrap">{email.message}</div>
                                        {email.attachments && email.attachments.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {email.attachments.map((attachment, index) => (
                                                    <a
                                                        key={index}
                                                        href={attachment.fileurl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                                                    >
                                                        <FiPaperclip className="text-gray-600" />
                                                        <span className="text-sm truncate max-w-[150px]">{attachment.filename}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
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
                                    <>
                                        {email.message}
                                        {email.attachments && email.attachments.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {email.attachments.map((attachment, index) => (
                                                    <a
                                                        key={index}
                                                        href={attachment.fileurl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
                                                    >
                                                        <FiPaperclip className="text-gray-600" />
                                                        <span className="text-sm truncate max-w-[150px]">{attachment.filename}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {index < emailThread.length - 1 && (
                                <hr className="my-4 border-t border-dashed border-gray-200" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Forward Composer */}
                {showForward && (
                    <div className='mt-8 border rounded-lg p-4'>
                        <div className='mb-4'>
                            <div className='text-sm text-gray-600'>
                                <span className='font-medium'>To: </span>
                                <input
                                    type="text"
                                    className='border rounded px-2 py-1 w-full'
                                    placeholder='Enter recipient emails (separate with commas)'
                                    value={forwardTo}
                                    onChange={(e) => setForwardTo(e.target.value)}
                                />
                            </div>
                            <div className='text-sm text-gray-600 mt-2'>
                                <span className='font-medium'>Subject: </span>
                                Fwd: {selectedEmail.subject}
                            </div>
                        </div>

                        <textarea
                            className='w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2'
                            placeholder='Add a message (optional)'
                            value={forwardMessage}
                            onChange={(e) => setForwardMessage(e.target.value)}
                        />

                        {/* Forward Attachments */}
                        <AttachmentButton handleFileChange={handleForwardFileChange} attachments={forwardAttachments} setAttachments={setForwardAttachments}/>


                        {/* Original Email Preview */}
                        <div className='border-t pt-4'>
                            <div className='text-sm text-gray-500 mb-2'>---------- Forwarded message ----------</div>
                            <div className='text-sm text-gray-600'>
                                <div>From: {selectedEmail.senderId.fullname} &lt;{selectedEmail.senderId.email}&gt;</div>
                                <div>Date: {new Date(selectedEmail.createdAt).toLocaleString()}</div>
                                <div>Subject: {selectedEmail.subject}</div>
                                <div>To: {selectedEmail.receiverIds.map(receiver => `${receiver.fullname} <${receiver.email}>`).join(', ')}</div>
                                <div className='mt-4 whitespace-pre-wrap'>{selectedEmail.message}</div>
                            </div>
                        </div>

                        <div className='flex justify-end gap-2 mt-4'>
                            <button
                                className='px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg'
                                onClick={() => {
                                    setShowForward(false);
                                    setForwardTo('');
                                    setForwardMessage('');
                                    setForwardAttachments([]);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className='px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                                onClick={handleForwardEmail}
                            >
                                Forward
                            </button>
                        </div>
                    </div>
                )}

                {/* Reply Composer */}
                {showReply && (
                    <div className='mt-8 border rounded-lg p-4'>
                        <div className='mb-4'>
                            <div className='text-sm text-gray-600'>
                                <span className='font-medium'>To: </span>
                                {selectedEmail.receiverIds.map(receiver => receiver.fullname).join(', ')} &lt;{selectedEmail.receiverIds[0].email}&gt;
                            </div>
                            <div className='text-sm text-gray-600'>
                                <span className='font-medium'>Subject: </span>
                                Re: {selectedEmail.subject}
                            </div>
                        </div>

                        <textarea
                            className='w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2'
                            placeholder='Write your reply...'
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                        />

                        {/* Reply Attachments */}
                        <AttachmentButton handleFileChange={handleReplyFileChange} attachments={replyAttachments} setAttachments={setReplyAttachments}/>


                        {/* Quoted Text Section */}
                        <div className='mt-4 border-t pt-4'>
                            <div
                                className='flex items-center gap-2 text-sm text-gray-600 cursor-pointer'
                                onClick={() => setShowQuotedText(!showQuotedText)}
                            >
                                {showQuotedText ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                <span>Quoted text</span>
                            </div>
                            {showQuotedText && (
                                <div className='mt-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600 whitespace-pre-wrap'>
                                    {formatQuotedText(selectedEmail)}
                                </div>
                            )}
                        </div>

                        <div className='flex justify-end gap-2 mt-4'>
                            <button
                                className='px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg'
                                onClick={() => {
                                    setShowReply(false);
                                    setReplyMessage('');
                                    setReplyAttachments([]);
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
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Email Details</h2>
                {renderReadReceipt()}
            </div>
        </div>
    )
}

export default SentMail
