const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your username'],
    unique: [true, 'This username already exists!'],
    validate: {
      validator: function (value) {
        return /^[a-z0-9_]+$/.test(value);
      },
      message: 'No special character, space or uppercase in username',
    },
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address!'],
    unique: [true, 'This email already exists!'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address!'],
  },
  country: {
    type: String,
    required: [true, 'Please provide your country name!'],
  },
  mobile_number: {
    type: String,
    required: [true, 'Please provide your country name!'],
    unique: [true, 'This mobile number already exists!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    validate: {
      validator: validator.isStrongPassword,
      message:
        'Password must be at least 8 characters long, combined with lowercase and uppercase letters, numbers and symbols',
    },
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Password confirmation does not match!',
    },
  },
  OTP: {
    type: String,
    required: [true, 'OTP is a required field!'],
  },
  OTPExpires: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(8);
  this.OTP = await bcrypt.hash(this.OTP, salt);
  this.OTPExpires = Date.now() + 5 * 60 * 1000;
  next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  return await bcrypt.compare(canditatePassword, this.password);
};

userSchema.methods.compareOTP = async function (canditateOTP) {
  return await bcrypt.compare(canditateOTP, this.OTP);
};

module.exports = mongoose.model('User', userSchema);
