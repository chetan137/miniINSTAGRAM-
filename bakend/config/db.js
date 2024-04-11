

const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/my_instagram_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = { connect };
