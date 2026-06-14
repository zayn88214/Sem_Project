import User from '../models/User.js';
import Prediction from '../models/Prediction.js';
import Recommendation from '../models/Recommendation.js';
import Log from '../models/Log.js';
import { AppError } from '../utils/AppError.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
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

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { ...(role && { role }), ...(isActive !== undefined && { isActive }) },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await Log.create({
      userId: req.user.id,
      action: 'ADMIN_ACTION',
      resource: 'User',
      resourceId: id,
      details: { action: 'update', changes: { role, isActive } }
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await Log.create({
      userId: req.user.id,
      action: 'ADMIN_ACTION',
      resource: 'User',
      resourceId: id,
      details: { action: 'delete' }
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalPredictions = await Prediction.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const predictionsThisMonth = await Prediction.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recommendationsThisMonth = await Recommendation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        users: { total: totalUsers, farmers: totalFarmers, admins: totalAdmins },
        predictions: { total: totalPredictions, thisMonth: predictionsThisMonth },
        recommendations: { total: totalRecommendations, thisMonth: recommendationsThisMonth },
        newUsersThisMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPredictionStats = async (req, res, next) => {
  try {
    const totalPredictions = await Prediction.countDocuments();

    const diseaseCounts = await Prediction.aggregate([
      { $group: { _id: '$disease', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const avgConfidence = await Prediction.aggregate([
      { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
    ]);

    const severityDistribution = await Prediction.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPredictions,
        topDiseases: diseaseCounts,
        averageConfidence: avgConfidence[0]?.avgConfidence || 0,
        severityDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, userId } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;

    const logs = await Log.find(query)
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(query);

    res.status(200).json({
      success: true,
      logs,
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
