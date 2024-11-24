/*import { Router } from 'express';
import { estimateRide } from '../controllers/rideController';

const router = Router();

router.post('/ride/estimate', (req, res, next) => {
  estimateRide(req, res).catch(next);
});

export default router;*/

const express = require("express");
const router = express.Router();

// Importa a chave do arquivo .env
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Rota para retornar a API Key
router.get("/google-maps-api-key", (req, res) => {
  res.json({ apiKey: GOOGLE_MAPS_API_KEY });
});

module.exports = router;
