import React from 'react';
// import '../styles/input.css';

interface FormInputProps {
  label: string;
  type?: string;
  name: string;
  id?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const FormInputs: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  id = name,
  value,
  onChange,
  onFocus,
  onClick,
  placeholder,
  readOnly = false
}) => {
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={name} className="form-label" style={{ color: '#374151' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className="form-control p-2"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onClick={onClick}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default FormInputs;
