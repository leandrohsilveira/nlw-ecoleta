import React, { FC } from "react";
import { FiXCircle } from "react-icons/fi";

import { FieldError } from "../Form";

import styles from "./index.module.css";

interface ErrorMessageProps {
  error: FieldError;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error: { id, message } }) => {
  return (
    <div className={styles.fieldErrorMessage} key={id}>
      <FiXCircle />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
