import React from 'react';
import '../styles/cancelbutton.css';

export interface CancelButtonProps {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  processing?: boolean;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  text,
  children,
  onClick,
  type,
  disabled = false,
  processing = false,
  className = '',
}) => {
  return (
    <button
      className={`custom-red-btn ${className}`}
      onClick={onClick}
      type={type ?? 'button'}
      disabled={disabled || processing}
    >
      {processing && <span className="spinner" />}
      {children ?? text}
    </button>
  );
};

export default CancelButton;