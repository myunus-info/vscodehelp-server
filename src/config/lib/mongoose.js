const mongoose = require('mongoose');

function connectDB(DB) {
  mongoose.set('strictQuery', false);
  return mongoose.connect(DB);
}

module.exports = connectDB;
