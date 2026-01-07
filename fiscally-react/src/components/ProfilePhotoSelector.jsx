import { Trash, Upload, User } from 'lucide-react';
import React, { useRef, useState } from 'react'

const ProfilePhotoSelector = ({image, setImage}) => {
    const inputRef = useRef(null);
    const [previewURL, setPreviewURL] = useState(null);

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        if(file){
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreviewURL(preview);
        }
    }

    const handlRemoveImage = ()=>{
        setImage(null);
        setPreviewURL(null);
    }

    const onChooseFile = ()=>{
        inputRef.current?.click();  
    }
    return (
        <div className='flex justify-center mb-6'>
            <input 
            type="file"
            accept='image/*'
            ref={inputRef}
            onChange={handleImageChange}
            className='hidden'
            />

            {!image ?(
                <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative'>
                    <User className="text-purple-500 size={35}"/>
                    <button 
                    onClick={onChooseFile}
                    className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'></button>
                    <Upload size={15} className='text-purple-500'/>
                </div>
            ):(
                <div className='relative'>
                    <img 
                    src={previewURL} 
                    alt="profile photo"
                    className='w-20 h-20 rounded-full object-cover'
                    />
                    <button 
                    className='w-8 h-8 flex items-center justify-center bg-red-800 text-white rounded-full absolute -bottom-1 -right-1'
                    onClick={handlRemoveImage}>
                        <Trash size={15}/>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePhotoSelector