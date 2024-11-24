import React, { useState } from 'react';
import axios from '../services/api';
import "../styles/RideHistory.css";



const RideHistory: React.FC = () => {
  const [rides, setRides] = useState([]);
  const [customerId, setCustomerId] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`/ride/${customerId}`);
      setRides(response.data.rides);
    } catch (error: any) {
      alert(error.response?.data.error_description || 'Erro ao buscar histórico.');
    }
  };

  return (
    <div className="ride-history">
      <h1>Histórico de Viagens</h1>
      <input
        type="text"
        placeholder="ID do Usuário"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />
      <button onClick={fetchHistory}>Buscar</button>
      <ul>
        {rides.map((ride: any) => (
          <li key={ride.id}>
            {ride.date} - {ride.driver.name} - {ride.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RideHistory;
