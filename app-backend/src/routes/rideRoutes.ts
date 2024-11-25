/*import { Router } from 'express';
import { estimateRide } from '../controllers/rideController';

const router = Router();

router.post('/ride/estimate', (req, res, next) => {
  estimateRide(req, res).catch(next);
});
// Importa a chave do arquivo .env
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Rota para retornar a API Key
router.get("/google-maps-api-key", (req, res) => {
  res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

export default router;*/

import { Router, Request, Response } from 'express';
import { estimateRide, confirmRide, getRides } from '../controllers/rideController';

const router = Router();

router.post('/ride/estimate', (req: Request, res: Response, next) => {
  estimateRide(req, res).catch(next);
});

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.get("/google-maps-api-key", (req: Request, res: Response) => {
  res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

router.patch('/ride/confirm', (req: Request, res: Response, next) => {
  confirmRide(req, res).catch(next);
});

router.get('/ride/:customer_id', (req: Request, res: Response, next) => {
  getRides(req, res).catch(next);
});

export default router;
