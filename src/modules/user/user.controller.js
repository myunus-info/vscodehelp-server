const path = require('path');
const { generateAccessToken } = require(path.join(process.cwd(), 'src/modules/user/user.service.js'));
const { asyncHandler, AppError } = require(path.join(process.cwd(), 'src/modules/core/errors'));
const User = require('./user.model');
const generateOTP = require('../core/utils/generateOTP');

const register = asyncHandler(async (req, res, next) => {
  const { username, email, country, mobile_number, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return next(new AppError(400, 'User already exists!'));
  }

  const OTP = generateOTP();
  const newUser = await User.create({
    username,
    email,
    country,
    mobile_number,
    password,
    confirmPassword,
    OTP,
  });

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    user: newUser,
  });
});

module.exports = {
  register,
};
