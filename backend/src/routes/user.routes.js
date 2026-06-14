import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);
router.get('/prediction-history', userController.getPredictionHistory);

export default router;
