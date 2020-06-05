import React from "react";

import logo from "../assets/logo.svg";

import "./index.css";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const CreatePoint = () => {
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

            <div className="field-group">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select name="uf" id="uf">
                  <option value="0">Selecione um estado</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select name="city" id="city">
                  <option value="0">Selecione uma cidade</option>
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
              <li>
                <img
                  src="http://localhost:3333/uploads/oleo.svg"
                  alt="Item Óleo"
                />
                <span>Óleo de Cozinha</span>
              </li>
              <li className="selected">
                <img
                  src="http://localhost:3333/uploads/oleo.svg"
                  alt="Item Óleo"
                />
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img
                  src="http://localhost:3333/uploads/oleo.svg"
                  alt="Item Óleo"
                />
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img
                  src="http://localhost:3333/uploads/oleo.svg"
                  alt="Item Óleo"
                />
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img
                  src="http://localhost:3333/uploads/oleo.svg"
                  alt="Item Óleo"
                />
                <span>Óleo de Cozinha</span>
              </li>
              <li>
                <img
                  src="http://localhost:3333/uploads/oleo.svg"
                  alt="Item Óleo"
                />
                <span>Óleo de Cozinha</span>
              </li>
            </ul>
          </fieldset>

          <button type="submit">Cadastrar ponto de coleta</button>
        </form>
      </main>
    </div>
  );
};

export default CreatePoint;
