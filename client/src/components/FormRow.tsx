import React from "react";

export interface FormRowProps {
  name: string;
  type?: string ;
  value: string ;
  handleChange: (el:  React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  labelText: string;
}

const FormRow = ({
  name,
  type,
  value,
  handleChange,
  labelText,
}: FormRowProps): JSX.Element => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        name={name}
        className="form-input"
        value={value}
        onChange={handleChange}
        type={type}
      />
    </div>
  );
};

export default FormRow;
