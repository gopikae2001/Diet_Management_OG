import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  width?: number | string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, title, width = 600, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title || 'Modal'}
      style={{
        content: {
          maxWidth: width,
          width: '100%',
          margin: 'auto',
          borderRadius: 12,
          padding: 32,
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 1000,
        },
      }}
    >
      {title && <h2 style={{ marginBottom: 18 }}>{title}</h2>}
      {children}
    </Modal>
  );
};

export default CustomModal; 