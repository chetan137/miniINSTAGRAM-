const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI
const connect = async () => {
  try {

  const uri = 'mongodb+srv://chetanshende1111:4u3Zeg8nPBqs673i@cluster1.lz4kreq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
  useUnifiedTopology: true,



    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = { connect };
