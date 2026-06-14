import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';
import { AppError } from '../utils/AppError.js';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'farmer' } = req.body;

    // Validation
    if (!name || !email || !password) {
      throw new AppError('Please provide all required fields', 400);
    }

    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      throw new AppError('User already exists with that email', 409);
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role
    });

    // Log action
    await Log.create({
      userId: user._id,
      action: 'REGISTER',
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log action
    await Log.create({
      userId: user._id,
      action: 'LOGIN',
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user.toJSON(),
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      tokens: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    next(new AppError('Invalid refresh token', 401));
  }
};

export const logout = async (req, res, next) => {
  try {
    // Log action
    await Log.create({
      userId: req.user?.id,
      action: 'LOGOUT',
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
