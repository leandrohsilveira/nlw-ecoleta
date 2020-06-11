import React, { ChangeEvent, useState } from "react";
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
}

function InputField({
  id,
  name,
  label,
  errors = [],
  type = "text",
  grouped = false,
  required = false,
}: InputFieldProps) {
  const [dirty, setDirty] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    !dirty && setDirty(true);
  }

  return (
    <Field
      htmlFor={id ?? String(name)}
      label={label}
      grouped={grouped}
      errors={dirty ? errors : []}
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
