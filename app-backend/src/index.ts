/*require('dotenv').config();
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
*/

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const cors = require('cors');
const express = require('express');
const app = express();
const rideRoutes = require('./routes/rideRoutes').default; // Certifique-se que o caminho está correto

// Configuração de CORS
app.use(cors({
  origin: ['http://localhost', 'http://172.31.128.1', 'http://192.168.1.11'], // URLs permitidas
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Middleware para parsear JSON
app.use(express.json());

// Usando as rotas
app.use('/api', rideRoutes); // Certifique-se de usar '/api' ou outro prefixo adequado

app.listen(8080, () => {
  console.log("Servidor backend rodando na porta 8080");
});
