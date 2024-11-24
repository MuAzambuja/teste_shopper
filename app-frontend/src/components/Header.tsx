import React from "react";
import { Link } from 'react-router-dom';
import './styles/Header.css';

const Header: React.FC = ()=> {
    return(
        <header className="header">
            <nav>
                <Link to='/'>Solicitar viagem</Link>
                <Link to='/history'>Histórico de viagens</Link>
            </nav>
        </header>
    );
};

export default Header;