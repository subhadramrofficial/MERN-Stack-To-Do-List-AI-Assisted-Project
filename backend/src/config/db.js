const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ has default settings for useNewUrlParser, useUnifiedTopology
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 Make sure MongoDB service is running locally or provide a valid MongoDB Atlas URI in .env');
    process.exit(1);
  }
};

module.exports = connectDB;
