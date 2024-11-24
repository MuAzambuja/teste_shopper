import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/RideOptions.css";

import axios from 'axios';

const RideOptions: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleChooseDriver = async (driver: any) => {
    try {
      await axios.patch('/ride/confirm', { ...state, driver });
      navigate('/history');
    } catch (error: any) {
      alert(error.response?.data.error_description || 'Erro ao confirmar a viagem.');
    }
  };

  return (
    <div className="ride-options">
      <h1>Opções de Viagem</h1>
      <div className="options">
        {state.options.map((driver: any) => (
          <div key={driver.id} className="driver-card">
            <h2>{driver.name}</h2>
            <p>{driver.description}</p>
            <button onClick={() => handleChooseDriver(driver)}>Escolher</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOptions;
