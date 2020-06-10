import React, { FC, PropsWithChildren } from "react";

import styles from "./index.module.css";

interface FieldProps {
  label: string;
  htmlFor: string;
  grouped?: boolean;
}

const Field: FC<PropsWithChildren<FieldProps>> = ({
  htmlFor,
  label,
  children,
  grouped = false,
}) => {
  return (
    <div className={`${styles.field} ${grouped ? styles.grouped : ""}`}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
};

export default Field;
