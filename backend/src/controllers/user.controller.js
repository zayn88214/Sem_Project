import User from '../models/User.js';
import Log from '../models/Log.js';
import { AppError } from '../utils/AppError.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
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

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, state, pincode, farmSize, cropType, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(pincode && { pincode }),
        ...(farmSize && { farmSize }),
        ...(cropType && { cropType }),
        ...(avatar && { avatar })
      },
      { new: true, runValidators: true }
    );

    await Log.create({
      userId: req.user.id,
      action: 'PROFILE_UPDATE',
      status: 'success',
      resource: 'User',
      resourceId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new AppError('Please provide all required fields', 400);
    }

    if (newPassword !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    if (newPassword.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw new AppError('Old password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    await Log.create({
      userId: req.user.id,
      action: 'PASSWORD_CHANGE',
      status: 'success'
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      throw new AppError('Password is required to delete account', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Password is incorrect', 401);
    }

    await Log.create({
      userId: req.user.id,
      action: 'USER_DELETE',
      status: 'success'
    });

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
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
