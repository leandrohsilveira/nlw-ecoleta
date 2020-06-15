import React, { ChangeEvent, ChangeEventHandler } from "react";
import Field from "../Field";

import styles from "./index.module.css";
import { ValidationProps, FieldError } from "../Form";

interface InputFieldProps extends ValidationProps {
  name: string;
  label: string;
  id?: string;
  type?: "text" | "number" | "email";
  errors?: FieldError[];
  grouped?: boolean;
  disabled?: boolean;
  value?: string | number | string[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

function InputField({
  id,
  name,
  label,
  onChange,
  value,
  errors = [],
  type = "text",
  grouped = false,
  required = false,
  disabled = false,
}: InputFieldProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e);
  }

  return (
    <Field
      htmlFor={id ?? String(name)}
      label={label}
      grouped={grouped}
      errors={errors}
      required={required}
    >
      <input
        disabled={disabled}
        required={required}
        className={styles.inputField}
        id={id ?? String(name)}
        type={type}
        name={String(name)}
        onChange={handleChange}
        value={value}
      />
    </Field>
  );
}

export default InputField;
