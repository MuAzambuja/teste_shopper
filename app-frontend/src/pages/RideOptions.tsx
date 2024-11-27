import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapWithRoute from "../components/MapWithRoute";
import "../styles/RideOptions.css";
import axios from "../services/api";

const RideOptions: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <div>Dados não disponíveis</div>;
  }

  const { origin, destination, options, distance } = state;

  const handleChooseDriver = async (driver: any) => {
    try {
      await axios.patch("/ride/confirm", { ...state, driver });
      navigate("/history");
    } catch (error: any) {
      alert(error.response?.data.error_description || "Erro ao confirmar a viagem.");
    }
  };

  return (
    <div className="ride-options-container">
      <h1 className="ride-options-title">Opções de Viagem</h1>
      <div className="ride-options-content">
        <div className="drivers-list">
          {options.map((driver: any) => (
            <div key={driver.id} className="driver-card">
              <h3>{driver.name}</h3>
              <p>{driver.description}</p>
              <p className="driver-vehicle">Veículo: {driver.vehicle}</p>
              <p className="value">Valor: R${driver.value}</p>
              <p className="driver-review">Avaliação: {driver.review.rating} - {driver.review.comment}</p>
              <button className="choose-btn" onClick={() => handleChooseDriver(driver)}>Escolher</button>
            </div>
          ))}
        </div>
        <div className="map-container">
          <MapWithRoute origin={origin} destination={destination} distance={distance} />
        </div>
      </div>
    </div>
  );
};

export default RideOptions;
