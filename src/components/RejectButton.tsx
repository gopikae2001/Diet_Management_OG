import React from 'react';
import styles from '../styles/RejectBtn.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface RejectButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
}

const RejectButton: React.FC<RejectButtonProps> = ({ 
  onClick, 
  size = 14,
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.rejectButton} ${className}`}
      aria-label="Reject"
      style={{ fontSize: size }}
    >
      <FontAwesomeIcon icon={faXmark} style={{ color: '#ffffff' }} />
    </button>
  );
};

export default RejectButton;
