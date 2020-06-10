import React, { FC, ChangeEventHandler } from "react";
import Field from "../Field";

import styles from "./index.module.css";

interface SelectFieldItem {
  key?: string | number;
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectFieldProps {
  id?: string;
  label: string;
  name: string;
  grouped?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  initialValue?: string;
  placeholder?: SelectFieldItem;
  items: SelectFieldItem[];
}

const SelectField: FC<SelectFieldProps> = ({
  id,
  name,
  label,
  value,
  items,
  onChange,
  placeholder,
  grouped = false,
}) => {
  return (
    <Field htmlFor={id ?? name} label={label} grouped={grouped}>
      <select
        className={styles.selectField}
        id={id ?? name}
        name={name}
        value={value}
        onChange={onChange}
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
};

export default SelectField;
