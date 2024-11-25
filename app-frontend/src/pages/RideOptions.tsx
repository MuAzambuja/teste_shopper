import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapWithRoute from "../components/MapWithRoute";
import "../styles/RideOptions.css";
import axios from "../services/api"

const RideOptions: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  /*if (!state) { return <div>Dados não disponíveis</div>; }
  const { origin, destination, options } = state;*/

  const handleChooseDriver = async (driver: any) => {
    try {
      await axios.patch("/ride/confirm", { ...state, driver });
      navigate("/history");
    } catch (error: any) {
      alert(error.response?.data.error_description || "Erro ao confirmar a viagem.");
    }
  };

  return (
    <div className="ride-options">
      <h1>Opções de Viagem</h1>
      <div className="content">
        <div className="map">
          <MapWithRoute origin={state.origin} destination={state.destination} />
        </div>
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
    </div>
  );
};

export default RideOptions;