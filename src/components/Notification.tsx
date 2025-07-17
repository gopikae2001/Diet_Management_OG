import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import '../styles/Notification.css'; 

interface NotificationToastProps {
  type: 'success' | 'error' | 'info' | 'approve' | 'reject' | 'delete';
  message: string;
  show: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ type, message, show, onClose }) => {
  if (!show) return null;

  const iconMap = {
    success: <CheckCircle size={18} />,
    approve: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    reject: <XCircle size={18} />,
    delete: <XCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{iconMap[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}><X size={16} /></button>
    </div>
  );
};

export default NotificationToast;
