import React from 'react'

const AttachmentButton = ({handleFileChange,attachments,setAttachments}) => {
    return (
        <div className="mt-2">
            <input
                type="file"
                id="forward-upload"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.docx,.mp4,.mov,.webm,.avi"
                className="hidden"
                onChange={handleFileChange}
            />

            <label
                htmlFor="forward-upload"
                className="inline-block cursor-pointer bg-blue-600 text-white text-sm px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
            >
                📎 Attach Files
            </label>

            {attachments.length > 0 && (
                <>
                    <p className="text-xs text-gray-600 mt-2">
                        Selected <span className="font-medium">{attachments.length}</span> / 10 file(s)
                    </p>
                    <ul className="mt-1 text-sm text-gray-700 space-y-1">
                        {attachments.map((file, idx) => (
                            <li key={idx} className="bg-gray-100 rounded px-2 py-1 flex justify-between items-center">
                                <span className="truncate max-w-[220px]">{file.name}</span>
                                <button
                                    className="text-red-500 text-base font-bold hover:text-red-700"
                                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}



                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>

    )
}

export default AttachmentButton
