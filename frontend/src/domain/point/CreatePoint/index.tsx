import React, { useState, useEffect, useMemo } from "react";

import logo from "../../../assets/logo.svg";

import "leaflet/dist/leaflet.css";

import "./index.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import itemService from "../../item/service/itemService";
import { useApiCallback } from "../../../util/api";
import ibgeService from "../../ibge/service/ibgeService";
import { Item } from "../../item/model";
import { IbgeUF, IbgeMunicipio } from "../../ibge/model";

L.Icon.Default.imagePath = "assets/images/";

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<IbgeUF[]>([]);
  const [municipios, setMunicipios] = useState<IbgeMunicipio[]>([]);

  const [fetchItems] = useApiCallback(itemService.findAll, setItems);
  const [fetchUfs, ufsLoading] = useApiCallback(ibgeService.findAllUfs, setUfs);
  const [fetchMunicipios, municipiosLoading] = useApiCallback(
    ibgeService.findAllMunicipiosByUf,
    setMunicipios
  );

  const [ufId, setUfId] = useState(-1);
  const selectedUf = useMemo(() => ufs.find((i) => i.id === ufId), [ufs, ufId]);

  const [municipioId, setMunicipioId] = useState(-1);
  //const selectedMunicipio = useMemo(() => municipios.find(m => m.id === municipioId), [municipios, municipioId]);

  useEffect(() => {
    fetchItems();
    fetchUfs();
  }, [fetchItems, fetchUfs]);

  useEffect(() => {
    ufId && fetchMunicipios(ufId);
  }, [ufId, fetchMunicipios]);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <main>
        <form>
          <h1>Cadastro do ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>
            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input id="name" type="text" name="name" />
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" name="email" />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input id="whatsapp" type="text" name="whatsapp" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={[-26.2779994, -48.8095674]} zoom={15}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[-26.2779994, -48.8095674]} />
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
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map(({ id, image_url, title }) => (
                <li key={id}>
                  <img src={image_url} alt={title} />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </main>
    </div>
  );
};

export default CreatePoint;
