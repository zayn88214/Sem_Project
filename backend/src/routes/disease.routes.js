import express from 'express';
import * as diseaseController from '../controllers/disease.controller.js';
import { authenticate } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.use(authenticate);

router.post('/predict', diseaseController.predictDisease);
router.post('/predict-file', upload.single('image'), diseaseController.predictDiseaseFromFile);
router.post('/predict-text', diseaseController.predictDiseaseFromText);
router.get('/history', diseaseController.getPredictionHistory);
router.get('/statistics', diseaseController.getDiseaseStatistics);
router.get('/:id', diseaseController.getPredictionById);
router.delete('/:id', diseaseController.deletePrediction);

export default router;
