import React, { FC, PropsWithChildren } from "react";

import styles from "./index.module.css";
import { FieldError } from "../Form";
import { FiXCircle } from "react-icons/fi";

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
      {errors.map(({ id, message }) => (
        <div className={styles.fieldErrorMessage} key={id}>
          <FiXCircle />
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
};

export default Field;
