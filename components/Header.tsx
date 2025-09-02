
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-5xl text-center mb-4 md:mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                Virtual Try-On Studio
            </h1>
            <p className="text-lg text-gray-600 mt-2">
                See yourself in your next favorite outfit before you buy.
            </p>
        </header>
    );
};
