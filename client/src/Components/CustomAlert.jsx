import React from 'react';

const CustomAlert = ({ message, type = 'error', onClose }) => {
    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md animate-fade-in">
            <div className="relative bg-white border border-gray-300 rounded-xl p-4 shadow-lg overflow-hidden">
                <div className="absolute inset-0 border-2 border-transparent rounded-xl animate-border-shimmer z-0"></div>

                <div className="relative z-10 flex items-center justify-between gap-4 font-[med] text-gray-800">
                    <p className="text-sm sm:text-base">{message}</p>
                    <button onClick={onClose} className="text-xl font-bold text-gray-500 hover:text-black transition">&times;</button>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
