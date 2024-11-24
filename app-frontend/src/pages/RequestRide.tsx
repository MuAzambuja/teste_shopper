import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import "../styles/RequestRide.css";

const RequestRide: React.FC = () => {
    const [customerId, setCustomerId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/ride/estimate', { customer_id: customerId, origin, destination });
            navigate('/options', { state: response.data });
        } catch (error: any) {
            setError(error.response?.data.error_description || 'Erro ao solicitar viagem');
        }
    };

    return (
        <div className='request-ride'>
            <h1>Solicite uma viagem</h1>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="customer-id">
                        <input
                            type='text'
                            id="customer-id"
                            placeholder='ID do usuário'
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-group">
                    <label htmlFor="origin">
                        <input
                            type='text'
                            id="origin"
                            placeholder='Rua conde de irajá, 85'
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="input-group">
                    <label htmlFor="destination">
                        <input
                            type='text'
                            id="destination"
                            placeholder='Rua Garibaldi, 421'
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type='submit'>Ver preços</button>
            </form>
        </div>
    );
};

export default RequestRide;



/*import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import "../styles/RequestRide.css";

const RequestRide: React.FC = ()=> {
    const [customerId, setCustomerId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const response = await axios.post('/ride/estimate', {customer_id: customerId, origin, destination});
            navigate('/options', {state: response.data});
        }catch (error: any){
            setError(error.response?.data.error_description || 'Erro ao solicitar viagem');
        }
    };
    return (
        <div className='request-ride'>
            <h1>Solicite uma viagem</h1>
            {error && <p className='error'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='ID do usuário'
                    value={customerId}
                    onChange={(e)=> setCustomerId(e.target.value)}
                    required
                />
                <input
                    type='text'
                    placeholder='Informe o local'
                    value={origin}
                    onChange={(e)=> setOrigin(e.target.value)}
                    required
                />
                <input
                    type='text'
                    placeholder='Informe o destino'
                    value={destination}
                    onChange={(e)=> setDestination(e.target.value)}
                    required
                />
                <button type='submit'>Ver preços</button>
            </form>
        </div>
    );
};

export default RequestRide;*/