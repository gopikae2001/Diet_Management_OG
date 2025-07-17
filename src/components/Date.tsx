import React from 'react';
// import '../styles/input.css';

interface FormDateInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const FormDateInput: React.FC<FormDateInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="form-control p-2"
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default FormDateInput;
