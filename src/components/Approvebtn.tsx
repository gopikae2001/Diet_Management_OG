import React from 'react';
import { FaCheck } from 'react-icons/fa';
import styles from '../styles/ApproveBtn.module.css';

interface ApproveBtnProps {
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
}

const ApproveBtn: React.FC<ApproveBtnProps> = ({ onClick, size = 13, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.approveBtn} ${className}`}
      aria-label="Approve"
    >
      <FaCheck size={size} />
    </button>
  );
};

export default ApproveBtn;
