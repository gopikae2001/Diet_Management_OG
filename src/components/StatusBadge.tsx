import React from 'react';
import '../styles/StatusBadge.css';

interface StatusBadgeProps {
  label: string;
  status: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status, onClick, active, disabled, style }) => {
  // Map status to class
  let statusClass = 'status-badge status';
  if (status === 'prepared') statusClass = 'status-badge status-preparing';
  else if (status === 'pending') statusClass = 'status-badge status-pending';
  else if (status === 'preparing') statusClass = 'status-badge status-preparing';
  else if (status === 'delivered') statusClass = 'status-badge status-diet-order-placed';
  else if (status === 'active') statusClass = 'status-badge status-diet-order-placed';
  else if (status === 'paused') statusClass = 'status-badge status-pending';
  else if (status === 'stopped') statusClass = 'status-badge status-rejected';

  return (
    <span
      className={statusClass}
      style={{
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        fontWeight: active ? 700 : 500,
        ...style,
      }}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </span>
  );
};

export default StatusBadge; 