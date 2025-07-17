import React from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../styles/RejectBtn.module.css';

interface RejectBtnProps {
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
}

const RejectBtn: React.FC<RejectBtnProps> = ({ 
  onClick, 
  size = 10, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.rejectBtn} ${className}`}
      aria-label="Reject"
      type="button"
    >
      <FaTimes size={size} className={styles.icon} />
    </button>
  );
};

export default RejectBtn;