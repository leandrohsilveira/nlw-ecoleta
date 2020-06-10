import React, { FC } from "react";

import styles from "./index.module.css";

interface FieldGroupProps {}

const FieldGroup: FC<React.PropsWithChildren<FieldGroupProps>> = ({
  children,
}) => {
  return <div className={styles.fieldGroup}>{children}</div>;
};

export default FieldGroup;
