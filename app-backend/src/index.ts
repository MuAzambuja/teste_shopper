/*import { fetchCoordinates } from './controllers/mapController';*/
/*
import express from 'express';
import dotenv from 'dotenv';
import rideRoutes from './routes/rideRoutes';

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware para tratar JSON
app.use(rideRoutes); // Importa e utiliza as rotas

app.listen(PORT, () => {
  console.log(`Server rodando em http://localhost:${PORT}`);
});
*/

const cors = require('cors');
const express = require('express');
const app = express();

// Configuração de CORS
app.use(cors({
  origin: 'http://localhost:80', // URL do frontend em desenvolvimento
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Suas rotas aqui
app.post('/ride/estimate', (req, res) => {
  // Sua lógica de backend
  res.send('Estimativa de viagem recebida');
});

// Inicie o servidor
app.listen(8080, () => {
  console.log("Servidor backend rodando na porta 8080");
});
