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

/*const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
  origin: ['http://localhost:80', 'http://172.31.128.1:80', 'http://192.168.1.11:80'], 
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

//app.use(cors());

app.use(express.json());

app.post('/ride/estimate', (req, res) => {
  res.send('Estimativa de viagem recebida');
});

app.listen(8080, () => {
  console.log("Servidor backend rodando na porta 8080");
});*/
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const rideRoutes = require('./routes/rideRoutes');

// Configuração de CORS
app.use(cors({
  origin: ['http://localhost', 'http://172.31.128.1', 'http://192.168.1.11'], // URL do frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Usando as rotas
app.use(rideRoutes);

app.listen(8080, () => {
  console.log("Servidor backend rodando na porta 8080");
});
