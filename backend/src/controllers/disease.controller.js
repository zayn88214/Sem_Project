import axios from 'axios';
import FormData from 'form-data';
import Prediction from '../models/Prediction.js';
import Log from '../models/Log.js';
import { AppError } from '../utils/AppError.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const predictDisease = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      throw new AppError('Image URL is required', 400);
    }

    console.log('🔍 Predicting from URL:', imageUrl);

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/api/disease/predict`, {
      image_url: imageUrl
    }, { timeout: 30000 });

    console.log('✓ ML Response Data:', JSON.stringify(response.data, null, 2));

    const { disease, confidence, treatment, prevention, severity } = response.data;

    // Save prediction to database
    const prediction = await Prediction.create({
      userId: req.user.id,
      imageUrl,
      disease: disease || 'Unknown',
      confidence: confidence || 0,
      treatment: treatment || 'Consult an expert',
      prevention: prevention || 'Maintain plant health',
      severity: (severity || 'medium').toLowerCase()
    });

    console.log('✓ Prediction saved to DB:', prediction._id);

    // Log action
    await Log.create({
      userId: req.user.id,
      action: 'DISEASE_PREDICTION',
      status: 'success',
      resource: 'Prediction',
      resourceId: prediction._id,
      details: { disease, confidence }
    });

    req.io.emit('NEW_PREDICTION', prediction);
    res.status(200).json({
      success: true,
      message: 'Disease prediction completed',
      prediction
    });
  } catch (error) {
    console.error('❌ Prediction URL Error:', error.response?.data || error.message);
    // Log failed action
    await Log.create({
      userId: req.user?.id,
      action: 'DISEASE_PREDICTION',
      status: 'failure',
      details: { error: error.message }
    });

    next(error);
  }
};

export const predictDiseaseFromFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    console.log('📁 Predicting from File:', req.file.originalname);

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Call ML service with proper headers
    const response = await axios.post(`${ML_SERVICE_URL}/api/disease/predict-file`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    console.log('✓ ML Response Data:', JSON.stringify(response.data, null, 2));

    const { disease, confidence, treatment, prevention, severity } = response.data;

    // Save prediction
    const prediction = await Prediction.create({
      userId: req.user.id,
      imageUrl: 'UPLOADED_FILE',
      disease: disease || 'Unknown',
      confidence: confidence || 0,
      treatment: treatment || 'Consult an expert',
      prevention: prevention || 'Maintain plant health',
      severity: (severity || 'medium').toLowerCase()
    });

    console.log('✓ Prediction saved to DB:', prediction._id);

    await Log.create({
      userId: req.user.id,
      action: 'DISEASE_PREDICTION',
      status: 'success',
      resource: 'Prediction',
      resourceId: prediction._id,
      details: { disease, confidence }
    });

    req.io.emit('NEW_PREDICTION', prediction);
    res.status(200).json({
      success: true,
      message: 'File analysis completed',
      prediction
    });
  } catch (error) {
    console.error('❌ Prediction File Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('ML Service Error Details:', JSON.stringify(error.response.data, null, 2));
    }
    next(error);
  }
};

export const predictDiseaseFromText = async (req, res, next) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      throw new AppError('Symptoms description is required', 400);
    }

    console.log('📝 Predicting from Text:', symptoms.substring(0, 50));

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/api/disease/predict-text`, {
      symptoms
    }, { timeout: 30000 });

    console.log('✓ ML Response Data:', JSON.stringify(response.data, null, 2));

    const { disease, confidence, treatment, prevention, severity } = response.data;

    // Save prediction
    const prediction = await Prediction.create({
      userId: req.user.id,
      imageUrl: 'TEXT_DESCRIPTION',
      disease: disease || 'Unknown',
      confidence: confidence || 0,
      treatment: treatment || 'Consult an expert',
      prevention: prevention || 'Maintain plant health',
      severity: (severity || 'medium').toLowerCase()
    });

    console.log('✓ Prediction saved to DB:', prediction._id);

    await Log.create({
      userId: req.user.id,
      action: 'DISEASE_PREDICTION',
      status: 'success',
      resource: 'Prediction',
      resourceId: prediction._id,
      details: { disease, confidence, symptoms: symptoms.substring(0, 100) }
    });

    req.io.emit('NEW_PREDICTION', prediction);
    res.status(200).json({
      success: true,
      message: 'Symptom analysis completed',
      prediction
    });
  } catch (error) {
    console.error('❌ Prediction Text Error:', error.response?.data || error.message);
    next(error);
  }
};

export const getPredictionHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const predictions = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Prediction.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      predictions,
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

export const getPredictionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!prediction) {
      throw new AppError('Prediction not found', 404);
    }

    res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    next(error);
  }
};

export const deletePrediction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!prediction) {
      throw new AppError('Prediction not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Prediction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getDiseaseStatistics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const totalPredictions = await Prediction.countDocuments({ userId: req.user.id });
    const recentPredictions = await Prediction.countDocuments({
      userId: req.user.id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const diseaseStats = await Prediction.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalPredictions,
        recentPredictions,
        topDiseases: diseaseStats
      }
    });
  } catch (error) {
    next(error);
  }
};
