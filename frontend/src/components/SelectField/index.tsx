import React, { useState, ChangeEventHandler, ChangeEvent } from "react";
import Field from "../Field";

import styles from "./index.module.css";
import { ValidationProps, FieldError } from "../Form";

export interface SelectFieldItem {
  key?: string | number;
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectFieldProps extends ValidationProps {
  name: string;
  label: string;
  items: SelectFieldItem[];
  id?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  placeholder?: SelectFieldItem;
  grouped?: boolean;
  disabled?: boolean;
  errors?: FieldError[];
  value?: number | string | string[];
}

function SelectField({
  id,
  name,
  label,
  items,
  placeholder,
  onChange,
  value,
  errors = [],
  required = false,
  grouped = false,
  disabled = false,
}: SelectFieldProps) {
  const [dirty, setDirty] = useState(false);

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    !dirty && setDirty(true);
    onChange?.call(onChange, e);
  }

  return (
    <Field
      htmlFor={id ?? String(name)}
      label={label}
      grouped={grouped}
      required={required}
      errors={dirty ? errors : []}
    >
      <select
        className={styles.selectField}
        id={id ?? String(name)}
        name={String(name)}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        value={value}
      >
        {!!placeholder && (
          <option
            key={placeholder.key ?? placeholder.value}
            value={placeholder.value}
            disabled={placeholder.disabled ?? true}
          >
            {placeholder.label}
          </option>
        )}
        {items.map(({ key, label, value, disabled }) => (
          <option key={key ?? value} value={value} disabled={disabled ?? false}>
            {label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export default SelectField;
