import React from "react";
import { FiLogIn } from "react-icons/fi";

import "./index.css";
import Logo from "../../components/Logo";
import LinkButton from "../../components/LinkButton";

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <Logo />
        </header>
        <main>
          <h1>Seu marketplace de coleta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>

          <LinkButton to="create-point" icon={<FiLogIn />}>
            Cadastre um ponto de coleta
          </LinkButton>
        </main>
      </div>
    </div>
  );
};

export default Home;
