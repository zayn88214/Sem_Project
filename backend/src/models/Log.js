import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'REGISTER',
      'DISEASE_PREDICTION',
      'CROP_RECOMMENDATION',
      'PROFILE_UPDATE',
      'PASSWORD_CHANGE',
      'USER_DELETE',
      'ADMIN_ACTION',
      'ERROR'
    ]
  },
  resource: {
    type: String,
    default: null
  },
  resourceId: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Index for efficient queries
logSchema.index({ userId: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });

// Set TTL for logs (keep for 90 days)
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const Log = mongoose.model('Log', logSchema);

export default Log;
