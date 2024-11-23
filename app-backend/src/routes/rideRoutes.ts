import { Router } from 'express';
import { estimateRide } from '../controllers/rideController';

const router = Router();

// Rota para estimar o custo da viagem
router.post('/ride/estimate', (req, res, next) => {
  estimateRide(req, res).catch(next); // Captura erros e os passa para o middleware global
});

export default router;
