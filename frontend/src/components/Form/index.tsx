import React, {
  PropsWithChildren,
  useState,
  useEffect,
  FormEvent,
  useContext,
  useRef,
  useCallback,
} from "react";

import styles from "./index.module.css";

interface FieldValidationFunction<T> {
  (value: T): FieldError[] | undefined;
}

export interface ValidationProps {
  required?: boolean;
}

export interface FieldError {
  id: string;
  message: string;
}

type FormErrors<T> = { [P in keyof T]?: FieldError[] };

type FormValidators<T> = { [P in keyof T]?: FieldValidationFunction<P> };

export interface FormContextProps<T> {
  values: T;
  errors: FormErrors<T>;
}

interface FormProps<T> {
  title?: string;
  onSubmit: (values: T, errors: FormErrors<T>) => void;
  context: React.Context<FormContextProps<T>>;
  initialValues: T;
  validators?: FormValidators<T>;
}

function Form<T = any>({
  title,
  onSubmit,
  children,
  context,
  initialValues,
  validators,
}: PropsWithChildren<FormProps<T>>) {
  const Provider = context.Provider;

  const [ctxValue, setCtxValue] = useState<FormContextProps<T>>({
    values: initialValues,
    errors: {},
  });

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
      console.debug("Field validated", name, value, fieldErrors);
      return fieldErrors;
    },
    [validators]
  );

  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { values, errors } = ctxValue;
    onSubmit && onSubmit(values, errors);
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    const element = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = element;
    setCtxValue({
      ...ctxValue,
      values: {
        ...ctxValue.values,
        [name]: value,
      },
      errors: {
        ...ctxValue.errors,
        [name]: validate(element),
      },
    });
    console.debug("Form value changed", name, value);
  }

  useEffect(() => {
    const elements = formRef.current?.elements;
    if (elements) {
      setCtxValue((curr) => {
        const fieldErrors: FormErrors<T> = {};
        for (let i = 0; i < elements.length; i++) {
          const element = elements.item(i) as
            | HTMLInputElement
            | HTMLSelectElement;
          if (Object.keys(curr.values).includes(element.name))
            fieldErrors[element.name as keyof T] = validate(element);
        }

        return {
          ...curr,
          errors: fieldErrors,
        };
      });
    }
  }, [validate]);

  return (
    <Provider value={ctxValue}>
      <form
        ref={formRef}
        className={styles.form}
        onSubmit={handleSubmit}
        onChange={handleChange}
        noValidate
      >
        {!!title && <h1>{title}</h1>}
        {children}
      </form>
    </Provider>
  );
}

export function createFormContext<T>(): React.Context<FormContextProps<T>> {
  return React.createContext<FormContextProps<T>>({
    values: {} as T,
    errors: {},
  });
}

export function useFormContextValues<T>(
  context: React.Context<FormContextProps<T>>,
  initialValues: T
) {
  const [values, setValues] = useState(initialValues);
  const ctx = useContext(context);
  useEffect(() => {
    setValues(ctx.values);
  }, [ctx.values]);
  return values;
}

export default Form;
