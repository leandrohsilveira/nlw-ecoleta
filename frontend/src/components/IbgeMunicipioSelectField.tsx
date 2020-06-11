import React, {
  useMemo,
  ChangeEvent,
  useState,
  useEffect,
  useContext,
} from "react";
import SelectField, { SelectFieldItem } from "./SelectField";
import { useApiCallback, ibgeService, IbgeMunicipio } from "ecoleta-core";
import { FormContextProps } from "./Form";

interface IbgeMunicipioSelectFieldProps<T> {
  name: keyof T;
  ufName: keyof T;
  context: React.Context<FormContextProps<T>>;
  id?: string;
  label?: string;
  grouped?: boolean;
  placeholder?: string;
  loadingPlaceholder?: string;
  ufNotSelectedPlaceholder?: string;
  onChange?: (value?: IbgeMunicipio) => void;
}

function IbgeMunicipioSelectField<T>({
  id,
  context,
  onChange,
  name,
  ufName,
  label = "Cidade",
  placeholder = "Selecione uma cidade",
  loadingPlaceholder = "Carregando cidades...",
  ufNotSelectedPlaceholder = "Selecione uma UF primeiro",
  grouped = false,
}: IbgeMunicipioSelectFieldProps<T>) {
  const { values } = useContext(context);
  const uf = values[ufName];
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
      value: "",
      disabled: false,
    }),
    [loading, loadingPlaceholder, placeholder, uf, ufNotSelectedPlaceholder]
  );

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (onChange) {
      const newValueId = Number(e.target.value ?? "");
      onChange(municipios.find((municipio) => municipio.id === newValueId));
    }
  }

  useEffect(() => {
    if (uf) fetch(Number(uf));
    else setMunicipios([]);
    return () => cancel();
  }, [fetch, cancel, uf]);

  return (
    <SelectField
      id={id}
      name={name}
      label={label}
      grouped={grouped}
      context={context}
      items={items}
      placeholder={placeholderItem}
      onChange={handleChange}
      required
    />
  );
}

export default IbgeMunicipioSelectField;
