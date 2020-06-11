import React, {
  useContext,
  useState,
  ChangeEventHandler,
  ChangeEvent,
} from "react";
import Field from "../Field";

import styles from "./index.module.css";
import { FormContextProps, ValidationProps } from "../Form";

export interface SelectFieldItem {
  key?: string | number;
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectFieldProps<T> extends ValidationProps {
  id?: string;
  label: string;
  context: React.Context<FormContextProps<T>>;
  name: keyof T;
  grouped?: boolean;
  initialValue?: string;
  placeholder?: SelectFieldItem;
  items: SelectFieldItem[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
}

function SelectField<T>({
  id,
  name,
  label,
  context,
  items,
  placeholder,
  onChange,
  required = false,
  grouped = false,
}: SelectFieldProps<T>) {
  const { errors } = useContext(context);
  const [dirty, setDirty] = useState(false);
  const fieldErrors = errors[name];

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setDirty(true);
    onChange?.call(onChange, e);
  }

  return (
    <Field
      htmlFor={id ?? String(name)}
      label={label}
      grouped={grouped}
      required={required}
      errors={dirty ? fieldErrors : []}
    >
      <select
        className={styles.selectField}
        id={id ?? String(name)}
        name={String(name)}
        onChange={handleChange}
        required={required}
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
