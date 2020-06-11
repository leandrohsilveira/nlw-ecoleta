import React, { useMemo, ChangeEvent, useState, useEffect } from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import { IbgeUF, useApiCallback, ibgeService } from "ecoleta-core";
import { FormContextProps } from "./Form";

interface IbgeUfSelectFieldProps<T> {
  name: keyof T;
  context: React.Context<FormContextProps<T>>;
  id?: string;
  label?: string;
  grouped?: boolean;
  placeholder?: string;
  loadingPlaceholder?: string;
  onChange?: (value?: IbgeUF) => void;
}

function IbgeUfSelectField<T>({
  id,
  onChange,
  name,
  context,
  label = "Estado (UF)",
  placeholder = "Selecione um Estado (UF)",
  loadingPlaceholder = "Carregando estados...",
  grouped = false,
}: IbgeUfSelectFieldProps<T>) {
  const [ufs, setUfs] = useState<IbgeUF[]>([]);
  const [fetch, loading, cancel] = useApiCallback(
    ibgeService.findAllUfs,
    setUfs
  );
  const items = useMemo<SelectFieldItem[]>(
    () =>
      ufs.map(({ id, nome, sigla }) => ({
        label: `${nome} (${sigla})`,
        value: id,
      })),
    [ufs]
  );
  const placeholderItem = useMemo<SelectFieldItem>(
    () => ({
      label: loading ? loadingPlaceholder : placeholder,
      value: "",
      disabled: false,
    }),
    [loading, loadingPlaceholder, placeholder]
  );

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (onChange) {
      const newValueId = Number(e.target.value ?? "");
      onChange(ufs.find((uf) => uf.id === newValueId));
    }
  }

  useEffect(() => {
    fetch();
    return () => cancel();
  }, [fetch, cancel]);

  return (
    <SelectField
      id={id}
      name={name}
      context={context}
      label={label}
      grouped={grouped}
      onChange={handleChange}
      items={items}
      placeholder={placeholderItem}
      required
    />
  );
}

export default IbgeUfSelectField;
