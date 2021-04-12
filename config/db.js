// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("MongoDB database connection established successfully");
    });
  } catch (err) {
    console.error("MongoDB connection error: " + err.message);
    process.exit(1);
  }
};

module.exports = connectDB;