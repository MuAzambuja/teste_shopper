/*import { fetchCoordinates } from './controllers/mapController';*/
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
