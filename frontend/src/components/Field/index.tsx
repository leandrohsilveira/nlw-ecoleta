import React, { FC, PropsWithChildren } from "react";

import styles from "./index.module.css";
import { FieldError } from "../Form";
import ErrorMessage from "../ErrorMessage";

interface FieldProps {
  label: string;
  htmlFor: string;
  grouped?: boolean;
  errors?: FieldError[];
  required?: boolean;
}

const Field: FC<PropsWithChildren<FieldProps>> = ({
  htmlFor,
  label,
  children,
  grouped = false,
  required = false,
  errors = [],
}) => {
  return (
    <div
      className={`${styles.field} ${grouped ? styles.grouped : ""} ${
        errors.length ? styles.error : ""
      }`}
    >
      <label htmlFor={htmlFor}>{required ? `* ${label}` : label}</label>
      {children}
      {errors.map((error) => (
        <ErrorMessage key={error.id} error={error} />
      ))}
    </div>
  );
};

export default Field;
