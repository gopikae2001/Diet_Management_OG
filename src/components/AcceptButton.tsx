import React from 'react';
import styles from '../styles/ApproveBtn.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface ApproveButtonProps {
  onClick: (e: React.MouseEvent) => void;
  size?: number;
  className?: string;
}

const ApproveButton: React.FC<ApproveButtonProps> = ({ 
  onClick, 
  size = 14,
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.approveButton} ${className}`} // You can rename this to `styles.approveButton` in the CSS too
      aria-label="Approve"
      style={{ fontSize: size }}
    >
      <FontAwesomeIcon icon={faCheck} style={{ color: '#ffffff' }} />
    </button>
  );
};

export default ApproveButton;
