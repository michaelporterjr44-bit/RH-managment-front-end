import React from "react";

interface ToastProps {
    message: string;
    success?: boolean;
    show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, success = true, show }) => {
    if (!message) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-md text-sm shadow-lg transition-all duration-300 transform
        ${show ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      `}
        >
            <i
                className={`ri-notification-line text-lg ${success ? "text-green-600" : "text-red-600"
                    }`}
            ></i>
            <span>{message}</span>
        </div>
    );
};

export default Toast;
