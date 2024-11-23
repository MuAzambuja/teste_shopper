import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

// Middleware para calcular rota
export const calculateRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { origin, destination } = req.body;

    // Validações básicas no body da requisição
    if (!origin || !destination) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Origem e destino devem ser fornecidos.',
      });
    }

    if (origin === destination) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Origem e destino não podem ser o mesmo endereço.',
      });
    }

    // Chama a função para calcular rota
    const result = await calculateRoute(origin, destination);

    // Retorna os resultados calculados
    return res.status(200).json(result);
  } catch (error: any) {
    // Trata erros e retorna resposta adequada
    return res.status(500).json({
      error_code: 'ROUTE_CALCULATION_FAILED',
      error_description: error.message || 'Erro interno ao calcular rota.',
    });
  }
};

// Função de cálculo de rota
export const calculateRoute = async (origin: string, destination: string) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    throw new Error('A chave da API do Google Maps não está configurada!');
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json`;
  const params = {
    origin,
    destination,
    key: googleMapsApiKey,
  };

  const response = await axios.get(url, { params });

  if (response.data.status !== 'OK') {
    throw new Error(`Erro ao calcular rota: ${response.data.status}`);
  }

  const route = response.data.routes[0];
  const legs = route.legs[0]; // Considera a primeira rota e percurso
  return {
    origin: {
      latitude: legs.start_location.lat,
      longitude: legs.start_location.lng,
    },
    destination: {
      latitude: legs.end_location.lat,
      longitude: legs.end_location.lng,
    },
    distance: legs.distance.value / 1000, // em km
    duration: legs.duration.text, // em string
    rawResponse: response.data,
  };
};
