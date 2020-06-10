import React, { FC, ChangeEventHandler } from "react";
import Field from "../Field";

import styles from "./index.module.css";

interface InputFieldProps {
  id?: string;
  type?: "text" | "number" | "email";
  label: string;
  name: string;
  grouped?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  initialValue?: string;
}

const InputField: FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  grouped = false,
}) => {
  return (
    <Field htmlFor={id ?? name} label={label} grouped={grouped}>
      <input
        className={styles.inputField}
        id={id ?? name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </Field>
  );
};

export default InputField;
