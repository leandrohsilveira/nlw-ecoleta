import React, { useState, useEffect, useCallback } from "react";
import {
  Item,
  itemService,
  Point,
  pointService,
  useApiCallback,
  geolocationService,
  GeolocationModel,
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

L.Icon.Default.imagePath = "assets/images/";

interface CreatePointFormData {
  name: string;
  email: string;
  whatsapp: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<LatLngTuple>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [location, setLocation] = useState<GeolocationModel>();
  const history = useHistory();
  const [data, setData] = useState<CreatePointFormData>({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<FormErrors<CreatePointFormData>>({});

  const [mapCenter] = useGeolocation(latLngPositionParser, {
    latitude: 0,
    longitude: 0,
  });

  const [fetchItems, , cancelFetchItems] = useApiCallback(
    itemService.findAll,
    setItems
  );
  const [
    fetchUfAndCityOfPosition,
    ,
    cancelFetchUfAndCityOfPosition,
  ] = useApiCallback(geolocationService.getByLatAndLng, setLocation);

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

    if (!location) errors.position = "The map position is required";
    if (!selectedItems.length)
      errors.items = "Should select at least one collect item";

    if (!Object.keys(errors).length && selectedPosition && location) {
      const [latitude, longitude] = selectedPosition;

      const point: Point = {
        ...values,
        image: "fake-image.png",
        uf: location.state_code,
        city: location.city,
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
    return cancelFetchItems();
  }, [fetchItems, cancelFetchItems]);

  useEffect(() => {
    if (finished) setTimeout(() => history.push("/"), 2000);
  }, [finished, history]);

  useEffect(() => {
    if (selectedPosition) {
      const [lat, lng] = selectedPosition;
      fetchUfAndCityOfPosition(lat, lng);
    } else {
      setLocation(undefined);
    }
    return () => cancelFetchUfAndCityOfPosition();
  }, [
    fetchUfAndCityOfPosition,
    selectedPosition,
    cancelFetchUfAndCityOfPosition,
  ]);

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
