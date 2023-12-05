const path = require('path');
const { generateAccessToken } = require(path.join(process.cwd(), 'src/modules/user/user.service.js'));
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const User = require('./models/user.model');
const OTPModel = require('./models/OTP.model');
const generateOTP = require('../core/utils/generateOTP');
const Email = require('../../config/lib/nodemailer');

const register = asyncHandler(async (req, res, next) => {
  const { username, email, country, mobileNumber, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError(400, 'User already exists!'));
  }

  const OTP = generateOTP();
  let newUser;
  let OTPData;
  // Register User
  try {
    newUser = await User.create({
      username,
      email,
      country,
      mobileNumber,
      password,
      confirmPassword,
    });

    // Create OTP
    OTPData = await OTPModel.create({
      OTP,
      OTPExpires: Date.now() + 5 * 60 * 1000,
      user: newUser._id,
    });
  } catch (error) {
    return next(new AppError(500, 'Internal server error!'));
  }

  // Send OTP through email
  try {
    await new Email({
      email: newUser.email,
      username: newUser.username,
      otp: OTP,
    }).send();
  } catch (error) {
    return next(new AppError(500, `${error.name}: ${error.message}`));
  }

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user: newUser,
      OTPData,
    },
  });
});

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { OTP } = req.body;

  if (!OTP) {
    return next(new AppError(400, 'Please provide your OTP!'));
  }
  const existingOTP = await OTPModel.findOne({
    OTP,
    OTPExpires: { $gte: Date.now() },
  });

  if (!existingOTP) {
    return next(new AppError(400, 'OTP is invalid or has expired!'));
  }

  const user = await existingOTP.populate('user');
  await existingOTP.deleteOne();
  const accessToken = generateAccessToken(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    signed: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully!',
    data: {
      user,
      accessToken,
    },
  });
});

module.exports = {
  register,
  verifyOTP,
};
