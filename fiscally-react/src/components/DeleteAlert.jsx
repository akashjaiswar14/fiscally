import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'

const DeleteAlert = ({content, onDelete}) => {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <p className='text-sm'>{content}</p>
            <div className='flex justify-end mt-6'>
                <button
                    onClick={() => handleDelete()}
                    type='button'
                    disabled={loading}
                    className='add-btn add-btn-fill bg-purple-500 p-2 rounded-2xl text-white hover:bg-purple-400 cursor-pointer border border-purple-800'>
                    {loading ? (
                        <>
                            <LoaderCircle className='h-4 w-4 animated-spin'/>
                            Deleting...
                        </>
                    ) : (
                        <>
                            Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert