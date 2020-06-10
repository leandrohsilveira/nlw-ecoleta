import React, { FC, PropsWithChildren } from "react";

import styles from "./index.module.css";

interface FieldSetProps {
  title: string;
  hint?: string;
}

const FieldSet: FC<PropsWithChildren<FieldSetProps>> = ({
  title,
  hint,
  children,
}) => {
  return (
    <fieldset className={styles.fieldSet}>
      <legend>
        <h2>{title}</h2>
        {!!hint && <span>{hint}</span>}
      </legend>

      {children}
    </fieldset>
  );
};

export default FieldSet;
