import React from 'react';
// import '../styles/DietRequest.css';

interface AddressInputProps {
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const AddressInput: React.FC<AddressInputProps> = ({
  name,
  label = '',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} style={{ color: '#374151' }}>{label}</label>
      <textarea
        name={name}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      ></textarea>
    </div>
  );
};

export default AddressInput;
