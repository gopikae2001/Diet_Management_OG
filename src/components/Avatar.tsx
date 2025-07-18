import React from 'react';

interface AvatarProps {
  name: string;
  size?: number; // diameter in px
  style?: React.CSSProperties;
}

// Utility to get initials from name
function getInitials(name: string) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  return (
    (parts[0][0] || '').toUpperCase() +
    (parts[parts.length - 1][0] || '').toUpperCase()
  );
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 100, style }) => {
  const initials = getInitials(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#FEFFE5', // light yellow
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        color: '#555',
        fontWeight: 500,
        boxShadow: '0 0 0 1px #f5f5d5',
        ...style,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar; 