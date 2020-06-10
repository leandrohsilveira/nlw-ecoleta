import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  Item,
  IbgeUF,
  IbgeMunicipio,
  itemService,
  ibgeService,
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
import Form from "../../components/Form";

L.Icon.Default.imagePath = "assets/images/";

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<IbgeUF[]>([]);
  const [municipios, setMunicipios] = useState<IbgeMunicipio[]>([]);
  const [ufId, setUfId] = useState(-1);
  const [municipioId, setMunicipioId] = useState(-1);
  const [selectedPosition, setSelectedPosition] = useState<LatLngTuple>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [finished, setFinished] = useState(false);
  const history = useHistory();
  const selectedUf = useMemo(
    () => (ufId !== -1 ? ufs.find((i) => i.id === ufId) : null),
    [ufs, ufId]
  );
  const selectedMunicipio = useMemo(
    () =>
      municipioId !== -1 ? municipios.find((m) => m.id === municipioId) : null,
    [municipios, municipioId]
  );
  const [mapCenter] = useGeolocation(latLngPositionParser, {
    latitude: 0,
    longitude: 0,
  });

  const [fetchItems] = useApiCallback(itemService.findAll, setItems);
  const [fetchUfs, ufsLoading] = useApiCallback(ibgeService.findAllUfs, setUfs);
  const [fetchMunicipios, municipiosLoading] = useApiCallback(
    ibgeService.findAllMunicipiosByUf,
    setMunicipios
  );
  const handleFormDataChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((_formData) => ({
        ..._formData,
        [name]: value,
      }));
    },
    []
  );

  const handleItemClick = useCallback((id: number) => {
    setSelectedItems((_selectedItems) => {
      if (!_selectedItems.includes(id)) return [..._selectedItems, id];
      else return _selectedItems.filter((i) => i !== id);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: { [key: string]: string } = {};

    if (!formData.name) errors.name = "The name is required";
    if (!formData.email) errors.email = "The e-mail is required";
    if (!formData.whatsapp) errors.whatsapp = "The WhatsApp is required";
    if (!selectedPosition) errors.position = "The map position is required";
    if (!selectedUf) errors.uf = "The UF is required";
    if (!selectedMunicipio) errors.city = "The City is required";
    if (!selectedItems.length)
      errors.items = "Should select at least one collect item";

    if (
      !Object.keys(errors).length &&
      selectedPosition &&
      selectedMunicipio &&
      selectedUf
    ) {
      const [latitude, longitude] = selectedPosition;

      const point: Point = {
        ...formData,
        image: "fake-image.png",
        uf: selectedUf?.sigla,
        city: selectedMunicipio?.nome,
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
    fetchUfs();
  }, [fetchItems, fetchUfs]);

  useEffect(() => {
    ufId && fetchMunicipios(ufId);
  }, [ufId, fetchMunicipios]);

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
        <Form title="Cadastro do ponto de coleta" onSubmit={handleSubmit}>
          <FieldSet title="Dados">
            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormDataChange}
              />
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleFormDataChange}
                />
              </div>
            </div>
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

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select
                  name="uf"
                  id="uf"
                  value={ufId}
                  onChange={(e) => setUfId(Number(e.target.value))}
                >
                  {ufsLoading ? (
                    <option key={-1} value={-1} disabled>
                      Carregando UFS...
                    </option>
                  ) : (
                    <option key={-1} value={-1} disabled>
                      Selecione uma UF
                    </option>
                  )}

                  {ufs.map(({ id, nome, sigla }) => (
                    <option key={id} value={id}>
                      {nome} ({sigla})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  value={municipioId}
                  onChange={(e) => setMunicipioId(Number(e.target.value))}
                >
                  {selectedUf && !municipiosLoading && (
                    <option key={-1} value={-1} disabled>
                      Selecione uma cidade
                    </option>
                  )}
                  {!selectedUf && !municipiosLoading && (
                    <option key={-1} value={-1} disabled>
                      Selecione uma UF primeiro
                    </option>
                  )}
                  {municipiosLoading && (
                    <option key={-1} value={-1} disabled>
                      Carregando cidades de {selectedUf?.sigla}
                    </option>
                  )}
                  {municipios.map(({ id, nome }) => (
                    <option key={id} value={id}>
                      {nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
