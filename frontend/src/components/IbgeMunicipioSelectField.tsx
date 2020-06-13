import React, { useMemo, ChangeEvent, useState, useEffect } from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import {
  useApiCallback,
  ibgeService,
  IbgeMunicipio,
  IbgeUF,
  GeolocationModel,
} from "ecoleta-core";
import { FieldError } from "./Form";

interface IbgeMunicipioSelectFieldProps {
  name: string;
  id?: string;
  uf?: IbgeUF;
  label?: string;
  errors?: FieldError[];
  grouped?: boolean;
  location?: GeolocationModel;
  placeholder?: string;
  loadingPlaceholder?: string;
  ufNotSelectedPlaceholder?: string;
  onChange?: (value?: IbgeMunicipio) => void;
}

function IbgeMunicipioSelectField({
  id,
  onChange,
  name,
  uf,
  location,
  errors = [],
  label = "Cidade",
  placeholder = "Selecione uma cidade",
  loadingPlaceholder = "Carregando cidades...",
  ufNotSelectedPlaceholder = "Selecione uma UF primeiro",
  grouped = false,
}: IbgeMunicipioSelectFieldProps) {
  const [municipios, setMunicipios] = useState<IbgeMunicipio[]>([]);
  const [valueId, setValueId] = useState<number | string>("");
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
      value: "",
    }),
    [loading, loadingPlaceholder, placeholder, uf, ufNotSelectedPlaceholder]
  );

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (onChange) {
      const newValueId = Number(e.target.value ?? "");
      setValueId(newValueId);
      onChange(municipios.find((municipio) => municipio.id === newValueId));
    }
  }

  useEffect(() => {
    if (uf) fetch(uf.id);
    else setMunicipios([]);
    return () => cancel();
  }, [fetch, cancel, uf]);

  useEffect(() => {
    if (municipios.length) {
      let newValueId;
      let newMunicipio;
      if (location) {
        newMunicipio = municipios.find(
          (municipio) =>
            municipio.nome?.toUpperCase() === location.city?.toUpperCase()
        );
        newValueId = newMunicipio?.id ?? "";
      } else {
        newMunicipio = undefined;
        newValueId = "";
      }
      onChange && onChange(newMunicipio);
      setValueId(newValueId);
    }
  }, [municipios, location, onChange]);

  return (
    <SelectField
      id={id}
      name={name}
      label={label}
      grouped={grouped}
      items={items}
      placeholder={placeholderItem}
      onChange={handleChange}
      errors={errors}
      value={valueId}
      disabled={!!location}
      required
    />
  );
}

export default IbgeMunicipioSelectField;
