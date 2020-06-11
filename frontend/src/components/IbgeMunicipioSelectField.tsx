import React, { FC, useMemo, ChangeEvent, useState, useEffect } from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import {
  IbgeUF,
  useApiCallback,
  ibgeService,
  IbgeMunicipio,
} from "ecoleta-core";

interface IbgeMunicipioSelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  grouped?: boolean;
  uf?: IbgeUF;
  value?: IbgeMunicipio;
  placeholder?: string;
  loadingPlaceholder?: string;
  ufNotSelectedPlaceholder?: string;
  onChange?: (value?: IbgeMunicipio) => void;
}

const IbgeMunicipioSelectField: FC<IbgeMunicipioSelectFieldProps> = ({
  id,
  value,
  onChange,
  uf,
  name = "city",
  label = "Cidade",
  placeholder = "Selecione uma cidade",
  loadingPlaceholder = "Carregando cidades...",
  ufNotSelectedPlaceholder = "Selecione uma UF primeiro",
  grouped = false,
}) => {
  const valueId = useMemo(() => value?.id ?? -1, [value]);
  const [municipios, setMunicipios] = useState<IbgeMunicipio[]>([]);
  const [fetch, loading, cancel] = useApiCallback(
    ibgeService.findAllMunicipiosByUf,
    setMunicipios
  );
  const items = useMemo<SelectFieldItem[]>(
    () =>
      municipios.map(({ id, nome }) => ({
        label: nome,
        value: id,
      })),
    [municipios]
  );
  const placeholderItem = useMemo<SelectFieldItem>(
    () => ({
      label: loading
        ? loadingPlaceholder
        : uf
        ? placeholder
        : ufNotSelectedPlaceholder,
      value: -1,
    }),
    [loading, loadingPlaceholder, placeholder, uf, ufNotSelectedPlaceholder]
  );

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (onChange) {
      const newValueId = Number(e.target.value ?? "-1");
      onChange(municipios.find((municipio) => municipio.id === newValueId));
    }
  }

  useEffect(() => {
    if (uf) fetch(uf.id);
    return () => cancel();
  }, [fetch, cancel, uf]);

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

export default IbgeMunicipioSelectField;
