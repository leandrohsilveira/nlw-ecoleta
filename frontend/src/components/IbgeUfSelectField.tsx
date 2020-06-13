import React, { useMemo, ChangeEvent, useState, useEffect } from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import {
  IbgeUF,
  ibgeService,
  useApiCallback,
  GeolocationModel,
} from "ecoleta-core";
import { FieldError } from "./Form";

interface IbgeUfSelectFieldProps {
  name: string;
  id?: string;
  label?: string;
  errors?: FieldError[];
  grouped?: boolean;
  placeholder?: string;
  loadingPlaceholder?: string;
  location?: GeolocationModel;
  onChange?: (value?: IbgeUF) => void;
}

function IbgeUfSelectField<T>({
  id,
  onChange,
  name,
  location,
  errors = [],
  label = "Estado (UF)",
  placeholder = "Selecione um Estado (UF)",
  loadingPlaceholder = "Carregando estados...",
  grouped = false,
}: IbgeUfSelectFieldProps) {
  const [valueId, setValueId] = useState<number | string>("");
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
    }),
    [loading, loadingPlaceholder, placeholder]
  );

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (onChange) {
      const newValueId = Number(e.target.value ?? "");
      setValueId(newValueId);
      onChange(ufs.find((uf) => uf.id === newValueId));
    }
  }

  useEffect(() => {
    fetch();
    return () => cancel();
  }, [fetch, cancel]);

  useEffect(() => {
    if (location) {
      const value = ufs.find(
        (uf) => uf.sigla?.toUpperCase() === location.state_code?.toUpperCase()
      );
      if (value) {
        setValueId(value.id);
        onChange && onChange(value);
      }
    } else {
      setValueId("");
    }
  }, [location, ufs, onChange]);

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
      disabled={!!location}
      value={valueId}
      required
    />
  );
}

export default IbgeUfSelectField;
