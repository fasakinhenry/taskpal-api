const mongoose = require('mongoose');
const { IS_PRODUCTION } = require('../constants/app');

const connectDB = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGO_URI is required');
  try {
    await mongoose.connect(mongoUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    if (!IS_PRODUCTION) console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;
