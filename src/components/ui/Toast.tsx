import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2700); // Start exit animation before auto unmount
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // wait for animation
  };

  const icons = {
    success: <CheckCircle className="toast-icon text-success" size={20} />,
    error: <AlertCircle className="toast-icon text-danger" size={20} />,
    info: <Info className="toast-icon text-accent" size={20} />
  };

  return (
    <div className={`toast-message toast-${type} ${isExiting ? 'fade-out' : 'slide-in'}`}>
      <div className="toast-content">
        {icons[type]}
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
};
