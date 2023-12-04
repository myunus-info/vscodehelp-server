const mongoose = require('mongoose');

const OPTSchema = new mongoose.Schema({
  OTP: String,
  OTPExpires: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('OTP', OPTSchema);
