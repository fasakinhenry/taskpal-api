const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    budget: Number,
    location: String,
    category: String,
    status: {
        type: String,
        enum: ["Open", "accepted", "completed", "paid"],
        default: "open"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
