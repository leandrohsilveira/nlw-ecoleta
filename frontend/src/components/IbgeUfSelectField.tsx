import React, { FC, useMemo, ChangeEvent, useState, useEffect } from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import { IbgeUF, useApiCallback, ibgeService } from "ecoleta-core";

interface IbgeUfSelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  grouped?: boolean;
  value?: IbgeUF;
  placeholder?: string;
  loadingPlaceholder?: string;
  onChange?: (value?: IbgeUF) => void;
}

const IbgeUfSelectField: FC<IbgeUfSelectFieldProps> = ({
  id,
  value,
  onChange,
  name = "uf",
  label = "Estado (UF)",
  placeholder = "Selecione um Estado (UF)",
  loadingPlaceholder = "Carregando estados...",
  grouped = false,
}) => {
  const valueId = useMemo(() => value?.id ?? -1, [value]);
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
      value: -1,
    }),
    [loading, loadingPlaceholder, placeholder]
  );

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (onChange) {
      const newValueId = Number(e.target.value ?? "-1");
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
      value={valueId}
      onChange={handleChange}
      items={items}
      placeholder={placeholderItem}
    />
  );
};

export default IbgeUfSelectField;
