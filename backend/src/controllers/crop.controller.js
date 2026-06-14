import axios from 'axios';
import Recommendation from '../models/Recommendation.js';
import Log from '../models/Log.js';
import { AppError } from '../utils/AppError.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const recommendCrop = async (req, res, next) => {
  try {
    const { N, P, K, temperature, humidity, pH, rainfall } = req.body;

    // Validation - Allow 0 as a valid value
    if (N === undefined || P === undefined || K === undefined || 
        temperature === undefined || humidity === undefined || 
        pH === undefined || rainfall === undefined) {
      throw new AppError('Please provide all required soil parameters', 400);
    }

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/api/crop/recommend`, {
      N, P, K, temperature, humidity, pH, rainfall
    }, { timeout: 30000 });

    const { topRecommendation, topConfidence, recommendations } = response.data;

    // Save recommendation to database
    const recommendation = await Recommendation.create({
      userId: req.user.id,
      soilData: { 
        nitrogen: N, 
        phosphorus: P, 
        potassium: K, 
        temperature, 
        humidity, 
        pH, 
        rainfall 
      },
      recommendations,
      topRecommendation,
      topConfidence
    });

    // Log action
    await Log.create({
      userId: req.user.id,
      action: 'CROP_RECOMMENDATION',
      status: 'success',
      resource: 'Recommendation',
      resourceId: recommendation._id,
      details: { topRecommendation, topConfidence }
    });

    // Emit real-time event
    req.io.emit('NEW_RECOMMENDATION', recommendation);

    res.status(200).json({
      success: true,
      message: 'Crop recommendation completed',
      recommendation
    });
  } catch (error) {
    // Log failed action
    await Log.create({
      userId: req.user?.id,
      action: 'CROP_RECOMMENDATION',
      status: 'failure',
      details: { error: error.message }
    });

    next(error);
  }
};

export const getRecommendationHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const recommendations = await Recommendation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recommendation.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      recommendations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!recommendation) {
      throw new AppError('Recommendation not found', 404);
    }

    res.status(200).json({
      success: true,
      recommendation
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!recommendation) {
      throw new AppError('Recommendation not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendationStatistics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const totalRecommendations = await Recommendation.countDocuments({ userId: req.user.id });
    const recentRecommendations = await Recommendation.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const avgConfidence = await Recommendation.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: null, avgConfidence: { $avg: '$topConfidence' } } }
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalRecommendations,
        recentRecommendations,
        averageConfidence: avgConfidence[0]?.avgConfidence || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
