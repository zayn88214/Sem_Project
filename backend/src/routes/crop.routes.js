import express from 'express';
import * as cropController from '../controllers/crop.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(authenticate);

router.post('/recommend', cropController.recommendCrop);
router.get('/history', cropController.getRecommendationHistory);
router.get('/statistics', cropController.getRecommendationStatistics);
router.get('/:id', cropController.getRecommendationById);
router.delete('/:id', cropController.deleteRecommendation);

export default router;
