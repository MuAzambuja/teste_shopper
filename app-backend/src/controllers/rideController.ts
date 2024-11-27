/*import { Request, Response } from 'express';
import { calculateRoute } from '../services/googleMapsService';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configurar a conexão com o banco de dados
const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
});

// Função auxiliar para converter duração para minutos
function convertDurationToMinutes(duration: string): number {
  const parts = duration.split(' ');
  let totalMinutes = 0;
  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];
    if (unit.includes('hour')) {
      totalMinutes += value * 60;
    } else if (unit.includes('min')) {
      totalMinutes += value;
    }
  }
  return totalMinutes;
}

// BD para armazenar as viagens
const ridesDatabase: any[] = [];

// 1º Endpoint - POST /ride/estimate - Estima uma viagem
export const estimateRide = async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem, destino e ID do cliente são obrigatórios!",
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem e destino não podem ser iguais.",
    });
  }

  try {
    // Consulta API Routes do Maps
    const routeData = await calculateRoute(origin, destination);
    const distance = routeData.distance;
    const duration = routeData.duration;

    // Converter duração para minutos
    const durationInMinutes = convertDurationToMinutes(duration);

    // Buscar dados dos motoristas no banco de dados
    const result = await pool.query('SELECT * FROM drivers');
    const drivers = result.rows;

    // Filtra e calcula os valores dos motoristas
    const availableDrivers = drivers
      .filter((driver) => distance >= driver.kmminimo)
      .map((driver) => ({
        id: driver.id,
        name: driver.nome,
        description: driver.descricao,
        vehicle: driver.carro,
        review: { rating: driver.avaliacao, comment: driver.comentario },
        value: distance * driver.taxa,
      }))
      .sort((a, b) => a.value - b.value);

    // Salvando a estimativa de corrida no banco de dados
    await pool.query(
      'INSERT INTO rides (customer_id, origin, destination, distance, duration, driver, value) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [customer_id, origin, destination, distance, durationInMinutes, JSON.stringify(availableDrivers[0]), availableDrivers[0].value]
    );

    return res.status(200).json({
      origin: routeData.origin,
      destination: routeData.destination,
      distance,
      duration,
      options: availableDrivers,
      routeResponse: routeData.rawResponse,
    });
  } catch (error: any) {
    return res.status(500).json({
      error_code: "ROUTE_CALCULATION_FAILED",
      error_description: error.message,
    });
  }
};

// 2º Endpoint - PATCH /ride/confirm - Confirma uma viagem
export const confirmRide = async (req: Request, res: Response) => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  if (!customer_id || !origin || !destination || !distance || !duration || !driver || !value) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Todos os campos são obrigatórios!",
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Endereço de origem deve ser diferente de destino",
    });
  }

  // Verifica se o motorista existe no banco de dados
  const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [driver.id]);
  const driverExists = result.rows[0];
  if (!driverExists) {
    return res.status(404).json({
      error_code: "DRIVER_NOT_FOUND",
      error_description: "O motorista informado não foi encontrado",
    });
  }

  if (distance < driverExists.kmminimo) {
    return res.status(406).json({
      error_code: "INVALID_DISTANCE",
      error_description: `A distancia é muito curta para o motorista ${driver.name}`,
    });
  }

  // Atualizando a viagem no banco de dados
  await pool.query(
    'UPDATE rides SET driver = $1, value = $2 WHERE customer_id = $3 AND origin = $4 AND destination = $5',
    [JSON.stringify(driver), value, customer_id, origin, destination]
  );

  return res.status(200).json({ success: true });
};

// 3º Endpoint - GET /ride/{customer_id} - Retorna o histórico de viagens
export const getRides = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "O ID do usuário é obrigatório",
      });
    }

    let userRides = ridesDatabase.filter((ride) => ride.customer_id === customer_id);

    if (driver_id) {
      const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [driver_id]);
      const driver = result.rows[0];
      if (!driver) {
        return res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "O ID do motorista é inválido",
        });
      }

      userRides = userRides.filter((ride) => ride.driver.id === Number(driver_id));
    }

    if (userRides.length === 0) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhuma corrida encontrada",
      });
    }

    return res.status(200).json({
      customer_id,
      rides: userRides.sort((a, b) => b.date.getTime() - a.date.getTime()),
    });
  } catch (error) {
    console.error("Erro ao buscar corridas:", error);
    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro interno do servidor",
    });
  }
};
*/

import { Request, Response } from 'express';
import { calculateRoute } from '../services/googleMapsService';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configurar a conexão com o banco de dados
const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
});

// BD para armazenar as viagens
const ridesDatabase: any[] = [];

// Função auxiliar para converter duração para minutos
function convertDurationToMinutes(duration: string): number {
  const parts = duration.split(' ');
  let totalMinutes = 0;
  for (let i = 0; i < parts.length; i += 2) {
    const value = parseInt(parts[i]);
    const unit = parts[i + 1];
    if (unit.includes('hour')) {
      totalMinutes += value * 60;
    } else if (unit.includes('min')) {
      totalMinutes += value;
    }
  }
  return totalMinutes;
}

// Função para formatar o valor
function formatValue(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// 1º Endpoint - POST /ride/estimate - Estima uma viagem
export const estimateRide = async (req: Request, res: Response) => {
  const { customer_id, origin, destination } = req.body;

  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem, destino e ID do cliente são obrigatórios!",
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Origem e destino não podem ser iguais.",
    });
  }

  try {
    // Consulta API Routes do Maps
    const routeData = await calculateRoute(origin, destination);
    const distance = routeData.distance;
    const duration = routeData.duration;

    // Converter duração para minutos
    const durationInMinutes = convertDurationToMinutes(duration);

    // Buscar dados dos motoristas no banco de dados
    const result = await pool.query('SELECT * FROM drivers');
    const drivers = result.rows;

    // Filtra e calcula os valores dos motoristas
    const availableDrivers = drivers
      .filter((driver) => distance >= driver.kmminimo)
      .map((driver) => ({
        id: driver.id,
        name: driver.nome,
        description: driver.descricao,
        vehicle: driver.carro,
        review: { rating: driver.avaliacao, comment: driver.comentario },
        value: formatValue(distance * driver.taxa), // Formatar o valor aqui
      }))
      .sort((a, b) => parseFloat(a.value.replace(',', '.')) - parseFloat(b.value.replace(',', '.')));

    // Salvando a estimativa de corrida no banco de dados
    await pool.query(
      'INSERT INTO rides (customer_id, origin, destination, distance, duration, driver, value) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [customer_id, origin, destination, distance, durationInMinutes, JSON.stringify(availableDrivers[0]), parseFloat(availableDrivers[0].value.replace(',', '.'))]
    );

    return res.status(200).json({
      origin: routeData.origin,
      destination: routeData.destination,
      distance,
      duration,
      options: availableDrivers,
      routeResponse: routeData.rawResponse,
    });
  } catch (error: any) {
    return res.status(500).json({
      error_code: "ROUTE_CALCULATION_FAILED",
      error_description: error.message,
    });
  }
};

// 2º Endpoint - PATCH /ride/confirm - Confirma uma viagem
export const confirmRide = async (req: Request, res: Response) => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  if (!customer_id || !origin || !destination || !distance || !duration || !driver || !value) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Todos os campos são obrigatórios!",
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Endereço de origem deve ser diferente de destino",
    });
  }

  // Verifica se o motorista existe no banco de dados
  const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [driver.id]);
  const driverExists = result.rows[0];
  if (!driverExists) {
    return res.status(404).json({
      error_code: "DRIVER_NOT_FOUND",
      error_description: "O motorista informado não foi encontrado",
    });
  }

  if (distance < driverExists.kmminimo) {
    return res.status(406).json({
      error_code: "INVALID_DISTANCE",
      error_description: `A distancia é muito curta para o motorista ${driver.name}`,
    });
  }

  // Atualizando a viagem no banco de dados
  await pool.query(
    'UPDATE rides SET driver = $1, value = $2 WHERE customer_id = $3 AND origin = $4 AND destination = $5',
    [JSON.stringify(driver), parseFloat(value.replace(',', '.')), customer_id, origin, destination]
  );

  return res.status(200).json({ success: true });
};

// 3º Endpoint - GET /ride/{customer_id} - Retorna o histórico de viagens
export const getRides = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if (!customer_id) {
      return res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "O ID do usuário é obrigatório",
      });
    }

    let userRides = ridesDatabase.filter((ride) => ride.customer_id === customer_id);

    if (driver_id) {
      const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [driver_id]);
      const driver = result.rows[0];
      if (!driver) {
        return res.status(400).json({
          error_code: "INVALID_DRIVER",
          error_description: "O ID do motorista é inválido",
        });
      }

      userRides = userRides.filter((ride) => ride.driver.id === Number(driver_id));
    }

    if (userRides.length === 0) {
      return res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhuma corrida encontrada",
      });
    }

    return res.status(200).json({
      customer_id,
      rides: userRides.sort((a, b) => b.date.getTime() - a.date.getTime()),
    });
  } catch (error) {
    console.error("Erro ao buscar corridas:", error);
    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro interno do servidor",
    });
  }
};
