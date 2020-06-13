import React, { FC, PropsWithChildren } from "react";

import styles from "./index.module.css";
import { FieldError } from "../Form";
import ErrorMessage from "../ErrorMessage";

interface FieldSetProps {
  title: string;
  hint?: string;
  errors?: FieldError[];
}

const FieldSet: FC<PropsWithChildren<FieldSetProps>> = ({
  title,
  hint,
  children,
  errors = [],
}) => {
  return (
    <fieldset
      className={`${styles.fieldSet} ${errors.length ? styles.error : ""}`}
    >
      <legend>
        <h2>{title}</h2>
        {!!hint && (
          <span>
            {hint}
            {!!errors.length && (
              <div className={styles.errorsContainer}>
                {errors.map((error) => (
                  <ErrorMessage key={error.id} error={error} />
                ))}
              </div>
            )}
          </span>
        )}
      </legend>

      {children}
    </fieldset>
  );
};

export default FieldSet;
