import React, { useState, useEffect, useCallback } from "react";
import {
  Item,
  IbgeUF,
  IbgeMunicipio,
  itemService,
  Point,
  pointService,
  useApiCallback,
} from "ecoleta-core";

import "leaflet/dist/leaflet.css";
import "./index.css";

import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import L, { LeafletMouseEvent, LatLngTuple } from "leaflet";
import useGeolocation, { latLngPositionParser } from "../../util/location";
import Logo from "../../components/Logo";
import Overlay from "../../components/Overlay";
import Button from "../../components/Button";
import CollectItems from "../../components/CollectItems";
import FieldSet from "../../components/FieldSet";
import Form, { FormErrors } from "../../components/Form";
import InputField from "../../components/InputField";
import FieldGroup from "../../components/FieldGroup";
import IbgeUfSelectField from "../../components/IbgeUfSelectField";
import IbgeMunicipioSelectField from "../../components/IbgeMunicipioSelectField";

L.Icon.Default.imagePath = "assets/images/";

interface CreatePointFormData {
  name: string;
  email: string;
  whatsapp: string;
  uf: string | number | IbgeUF;
  city: string | number | IbgeMunicipio;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [uf, setUf] = useState<IbgeUF>();
  const [municipio, setMunicipio] = useState<IbgeMunicipio>();
  const [selectedPosition, setSelectedPosition] = useState<LatLngTuple>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const history = useHistory();
  const [data, setData] = useState<CreatePointFormData>({
    name: "",
    email: "",
    whatsapp: "",
    uf: "",
    city: "",
  });
  const [errors, setErrors] = useState<FormErrors<CreatePointFormData>>({});

  const [mapCenter] = useGeolocation(latLngPositionParser, {
    latitude: 0,
    longitude: 0,
  });

  const [fetchItems] = useApiCallback(itemService.findAll, setItems);

  const handleItemClick = useCallback((id: number) => {
    setSelectedItems((_selectedItems) => {
      if (!_selectedItems.includes(id)) return [..._selectedItems, id];
      else return _selectedItems.filter((i) => i !== id);
    });
  }, []);

  function handleValuesChanges(
    values: CreatePointFormData,
    errors: FormErrors<CreatePointFormData>
  ) {
    setData(values);
    setErrors(errors);
  }

  async function handleSubmit(values: CreatePointFormData) {
    const errors: { [key: string]: string } = {};

    if (!values.name) errors.name = "The name is required";
    if (!values.email) errors.email = "The e-mail is required";
    if (!values.whatsapp) errors.whatsapp = "The WhatsApp is required";
    if (!uf) errors.uf = "The UF is required";
    if (!municipio) errors.city = "The City is required";
    if (!selectedPosition) errors.position = "The map position is required";
    if (!selectedItems.length)
      errors.items = "Should select at least one collect item";

    if (!Object.keys(errors).length && selectedPosition && uf && municipio) {
      const [latitude, longitude] = selectedPosition;

      const point: Point = {
        ...values,
        image: "fake-image.png",
        uf: uf.sigla,
        city: municipio.nome,
        items: selectedItems,
        latitude,
        longitude,
      };

      await pointService.create(point);
      setFinished(true);
    } else {
      console.error("The form is invalid", errors);
    }
  }

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (finished) setTimeout(() => history.push("/"), 2000);
  }, [finished, history]);

  return (
    <div id="page-create-point">
      {finished && (
        <Overlay>
          <div className="success-message">
            <FiCheckCircle color="#33CB78" size={50} />
            <span>Cadastro concluído!</span>
          </div>
        </Overlay>
      )}
      <header>
        <Logo />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <main>
        <Form
          title="Cadastro do ponto de coleta"
          onSubmit={handleSubmit}
          onChange={handleValuesChanges}
          initialValues={data}
        >
          <FieldSet title="Dados">
            <InputField
              name="name"
              label="Nome da entidade"
              errors={errors.name}
              required
            />
            <FieldGroup>
              <InputField
                name="email"
                type="email"
                label="E-mail"
                errors={errors.email}
                required
                grouped
              />
              <InputField
                name="whatsapp"
                label="WhatsApp"
                errors={errors.whatsapp}
                required
                grouped
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet title="Endereço" hint="Selecione o endereço no mapa">
            <Map
              center={mapCenter}
              zoom={15}
              onClick={({ latlng }: LeafletMouseEvent) =>
                setSelectedPosition([latlng.lat, latlng.lng])
              }
            >
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {selectedPosition && <Marker position={selectedPosition} />}
            </Map>

            <FieldGroup>
              <IbgeUfSelectField
                name="uf"
                onChange={setUf}
                errors={errors.uf}
                grouped
              />
              <IbgeMunicipioSelectField
                name="city"
                uf={uf}
                onChange={setMunicipio}
                errors={errors.city}
                grouped
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet
            title="Ítens de coleta"
            hint="Selecione um ou mais ítens abaixo"
          >
            <CollectItems
              items={items}
              selectedItems={selectedItems}
              onItemClick={handleItemClick}
            />
          </FieldSet>

          <Button type="submit">Cadastrar ponto de coleta</Button>
        </Form>
      </main>
    </div>
  );
};

export default CreatePoint;
