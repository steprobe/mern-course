const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
  try {
    const db = config.get('mongoURI');
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
