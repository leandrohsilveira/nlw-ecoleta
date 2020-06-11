import React, { useContext, ChangeEvent, useState } from "react";
import Field from "../Field";

import styles from "./index.module.css";
import { FormContextProps, ValidationProps } from "../Form";

interface InputFieldProps<T> extends ValidationProps {
  name: keyof T;
  context: React.Context<FormContextProps<T>>;
  id?: string;
  type?: "text" | "number" | "email";
  label: string;
  grouped?: boolean;
}

function InputField<T>({
  id,
  name,
  label,
  context,
  type = "text",
  grouped = false,
  required = false,
}: InputFieldProps<T>) {
  const { errors } = useContext(context);
  const [dirty, setDirty] = useState(false);
  const fieldErrors = errors[name];

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setDirty(true);
  }

  return (
    <Field
      htmlFor={id ?? String(name)}
      label={label}
      grouped={grouped}
      errors={dirty ? fieldErrors : []}
      required={required}
    >
      <input
        required={required}
        className={styles.inputField}
        id={id ?? String(name)}
        type={type}
        name={String(name)}
        onChange={handleChange}
      />
    </Field>
  );
}

export default InputField;
