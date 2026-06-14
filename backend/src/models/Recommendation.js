import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soilData: {
    nitrogen: {
      type: Number,
      required: true
    },
    phosphorus: {
      type: Number,
      required: true
    },
    potassium: {
      type: Number,
      required: true
    },
    pH: {
      type: Number,
      required: true
    },
    rainfall: {
      type: Number,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    },
    humidity: {
      type: Number,
      required: true
    }
  },
  recommendations: [{
    crop: String,
    confidence: Number,
    suitability: String,
    seasonsToGrow: [String],
    harvestTime: String
  }],
  topRecommendation: {
    type: String,
    required: true
  },
  topConfidence: {
    type: Number,
    required: true
  },
  soilInsights: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

// Index for quick user lookups
recommendationSchema.index({ userId: 1, createdAt: -1 });

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
