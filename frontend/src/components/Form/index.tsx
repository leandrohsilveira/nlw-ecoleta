import React, {
  PropsWithChildren,
  useState,
  FormEvent,
  useCallback,
} from "react";

import styles from "./index.module.css";

export interface FieldValidationFunction<T> {
  (value: T): FieldError[] | undefined;
}

export interface ValidationProps {
  required?: boolean;
}

export interface FieldError {
  id: string;
  message: string;
}

export type FormErrors<T> = { [P in keyof T]?: FieldError[] };

export type FormValidators<T> = { [P in keyof T]?: FieldValidationFunction<P> };

export interface FormContextProps<T> {
  values: T;
  errors: FormErrors<T>;
}

export interface FormContextEventHandler<T> {
  (values: T, errors: FormErrors<T>): void;
}

interface FormProps<T> {
  initialValues: T;
  onSubmit: FormContextEventHandler<T>;
  onChange?: FormContextEventHandler<T>;
  validators?: FormValidators<T>;
  title?: string;
}

function Form<T = any>({
  title,
  onSubmit,
  onChange,
  children,
  initialValues,
  validators,
}: PropsWithChildren<FormProps<T>>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const validate = useCallback(
    (element: HTMLInputElement | HTMLSelectElement): FieldError[] => {
      const { name, value, required } = element;
      const fieldErrors: FieldError[] = [];
      if (required && !String(value))
        fieldErrors.push({
          id: "required",
          message: "Este campo é obrigatório",
        });
      if (validators) {
        const validator = validators[name as keyof T];
        validator
          ?.call(validator, value as any)
          ?.forEach((error) => fieldErrors.push(error));
      }
      console.debug("Form.validate", name, value, fieldErrors);
      return fieldErrors;
    },
    [validators]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit && onSubmit(values, errors);
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const element = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = element;
    console.debug("Form.handleChange", name, value);
    const newValues = {
      ...values,
      [name]: value,
    };
    setValues(newValues);
    const currFieldErrors = errors[name as keyof T];
    const fieldErrors = validate(element);

    let newErrors = errors;
    if (hasDifferentErrors(currFieldErrors ?? [], fieldErrors)) {
      console.log("Has different errors", currFieldErrors, fieldErrors);
      newErrors = {
        ...errors,
        [name]: fieldErrors,
      };
      setErrors(newErrors);
    }

    onChange && onChange(newValues, newErrors);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onChange={handleChange}
      noValidate
    >
      {!!title && <h1>{title}</h1>}
      {children}
    </form>
  );
}

function hasDifferentErrors(curr: FieldError[], news: FieldError[]) {
  return (
    news.length !== curr.length ||
    news.filter(
      (newError) => !curr.find((currError) => newError.id === currError.id)
    ).length > 0
  );
}

export default Form;
