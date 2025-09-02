
import React, { useRef, useCallback, useState } from 'react';

interface ImageUploaderProps {
    title: string;
    onImageUpload: (base64: string) => void;
    icon: React.ReactNode;
    uploadedImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload, icon, uploadedImage }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = useCallback((file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    onImageUpload(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onImageUpload]);

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files ? e.target.files[0] : null);
    };

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
    }, [handleFileChange]);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
            <div
                onClick={() => inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                className={`relative group w-full aspect-square max-w-sm bg-white rounded-3xl border-2 border-dashed transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden
                ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                ${uploadedImage ? 'border-solid' : ''}`}
            >
                <input
                    type="file"
                    ref={inputRef}
                    onChange={onFileInputChange}
                    accept="image/*"
                    className="hidden"
                />
                {uploadedImage ? (
                    <>
                        <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                            <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Change Image</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-500 p-4">
                        <div className={`w-16 h-16 mx-auto mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {icon}
                        </div>
                        <p className="font-semibold">Drag & drop an image here</p>
                        <p className="text-sm">or click to select a file</p>
                    </div>
                )}
            </div>
        </div>
    );
};
