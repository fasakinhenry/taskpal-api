const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    budget: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    category: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Open', 'accepted', 'completed', 'paid'],
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
