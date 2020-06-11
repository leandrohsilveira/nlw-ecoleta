import React, { useMemo, ChangeEvent, useState, useEffect } from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import { IbgeUF, ibgeService, useApiCallback } from "ecoleta-core";
import { FieldError } from "./Form";

interface IbgeUfSelectFieldProps {
  name: string;
  id?: string;
  label?: string;
  errors?: FieldError[];
  grouped?: boolean;
  placeholder?: string;
  loadingPlaceholder?: string;
  onChange?: (value?: IbgeUF) => void;
}

function IbgeUfSelectField<T>({
  id,
  onChange,
  name,
  errors = [],
  label = "Estado (UF)",
  placeholder = "Selecione um Estado (UF)",
  loadingPlaceholder = "Carregando estados...",
  grouped = false,
}: IbgeUfSelectFieldProps) {
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
      label={label}
      grouped={grouped}
      onChange={handleChange}
      items={items}
      placeholder={placeholderItem}
      errors={errors}
      required
    />
  );
}

export default IbgeUfSelectField;
