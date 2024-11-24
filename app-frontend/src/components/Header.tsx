import React from "react";
import { Link } from 'react-router-dom';
import "../styles/Header.css";  // Caminho ajustado para a pasta styles

const Header: React.FC = ()=> {
    return(
        <header className="header">
            <div className="logo">
                <h1>Muzer</h1>
            </div>
            <nav>
                <Link to='/'>Solicitar viagem</Link>
                <Link to='/history'>Histórico de viagens</Link>
            </nav>
        </header>
    );
};

export default Header;