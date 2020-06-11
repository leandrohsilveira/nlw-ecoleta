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
import Form, {
  createFormContext,
  useFormContextValues,
} from "../../components/Form";
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

const CreatePointFormContext = createFormContext<CreatePointFormData>();

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [uf, setUf] = useState<IbgeUF>();
  const [municipio, setMunicipio] = useState<IbgeMunicipio>();
  const [selectedPosition, setSelectedPosition] = useState<LatLngTuple>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const formData = useFormContextValues<CreatePointFormData>(
    CreatePointFormContext,
    {
      name: "",
      email: "",
      whatsapp: "",
      uf: "",
      city: "",
    }
  );
  const [finished, setFinished] = useState(false);
  const history = useHistory();

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

  async function handleSubmit(_formData: CreatePointFormData) {
    const errors: { [key: string]: string } = {};

    if (!_formData.name) errors.name = "The name is required";
    if (!_formData.email) errors.email = "The e-mail is required";
    if (!_formData.whatsapp) errors.whatsapp = "The WhatsApp is required";
    if (!uf) errors.uf = "The UF is required";
    if (!municipio) errors.city = "The City is required";
    if (!selectedPosition) errors.position = "The map position is required";
    if (!selectedItems.length)
      errors.items = "Should select at least one collect item";

    if (!Object.keys(errors).length && selectedPosition && uf && municipio) {
      const [latitude, longitude] = selectedPosition;

      const point: Point = {
        ..._formData,
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
          context={CreatePointFormContext}
          initialValues={formData}
        >
          <FieldSet title="Dados">
            <InputField
              name="name"
              label="Nome da entidade"
              context={CreatePointFormContext}
              required
            />
            <FieldGroup>
              <InputField
                name="email"
                type="email"
                label="E-mail"
                context={CreatePointFormContext}
                required
                grouped
              />
              <InputField
                name="whatsapp"
                label="WhatsApp"
                context={CreatePointFormContext}
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
                context={CreatePointFormContext}
                name="uf"
                onChange={setUf}
                grouped
              />
              <IbgeMunicipioSelectField
                context={CreatePointFormContext}
                name="city"
                ufName="uf"
                onChange={setMunicipio}
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
