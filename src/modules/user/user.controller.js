const path = require('path');
const { generateAccessToken } = require(path.join(process.cwd(), 'src/modules/user/user.service.js'));
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const User = require('./models/user.model');
const OTPModel = require('./models/OTP.model');
const UserDetail = require('./models/userDetails.model');
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
    await OTPModel.create({
      OTP,
      OTPExpires: Date.now() + 60 * 60 * 1000,
      user: newUser._id,
    });
  } catch (error) {
    return next(new AppError(500, `${error.message}`));
  }

  // Send OTP through email
  try {
    await new Email({
      email: newUser.email,
      username: newUser.username,
      otp: OTP,
    }).send();
  } catch (error) {
    return next(new AppError(500, `${error.message}`));
  }

  const accessToken = generateAccessToken(newUser);

  res.cookie('accessToken', accessToken, { httpOnly: true, signed: true });

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: {
      user: newUser,
      accessToken,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return next(new AppError(400, 'Please provide your credentials!'));
  }

  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) {
    return next(new AppError(401, 'Invalid credentials!'));
  }

  if (!(await user.comparePassword(password))) {
    return next(new AppError(401, 'Invalid credentials!'));
  }

  const accessToken = generateAccessToken(user);

  res.cookie('accessToken', accessToken, { httpOnly: true, signed: true });

  res.status(200).json({
    status: 'success',
    message: 'User logged in successfully!',
    data: {
      user,
      accessToken,
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
  await User.updateOne({ _id: req.user._id }, { $set: { isEmailVerified: true } });
  const user = await existingOTP.populate('user');
  const accessToken = generateAccessToken(user.user);

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

const registerUserDetails = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, address, state, zipCode, city } = req.body;

  const existingUserDetails = await UserDetail.findOne({ user: req.user._id });

  if (existingUserDetails) {
    return next(new AppError(400, 'User details already exist!'));
  }

  let userInfo;
  try {
    userInfo = await UserDetail.create({
      firstName,
      lastName,
      address,
      state,
      zipCode,
      city,
      user: req.user._id,
    });
  } catch (error) {
    return next(new AppError(500, `${error.name}: ${error.message}`));
  }

  const userDetails = await userInfo.populate('user');

  res.status(201).json({
    status: 'success',
    message: 'User details registered successfully!',
    userDetails,
  });
});

module.exports = {
  register,
  verifyOTP,
  registerUserDetails,
  login,
};
