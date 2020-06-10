import React, { FC, PropsWithChildren, FormEventHandler } from "react";

import styles from "./index.module.css";

interface FormProps {
  title?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const Form: FC<PropsWithChildren<FormProps>> = ({
  title,
  onSubmit,
  children,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {!!title && <h1>{title}</h1>}
      {children}
    </form>
  );
};

export default Form;
