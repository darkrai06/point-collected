const mongoose = require('mongoose');

const dailyPointSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Storing as 'YYYY-MM-DD'
    required: true
  },
  points_earned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Ensure a user has only one record per date
dailyPointSchema.index({ user_id: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyPoint', dailyPointSchema);
