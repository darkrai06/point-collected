const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'personal'
  },
  difficulty: {
    type: String,
    default: 'easy'
  },
  points: {
    type: Number,
    default: 5
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  completed_at: {
    type: Date,
    default: null
  },
  due_date: {
    type: Date,
    default: null
  },
  minutes: {
    type: Number,
    default: null
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

module.exports = mongoose.model('Task', taskSchema);
