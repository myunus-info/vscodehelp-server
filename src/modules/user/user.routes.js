const userController = require('./user.controller');

module.exports = app => {
  app.post('/api/users/register', userController.register);
  app.post('/api/users/verify-otp', userController.verifyOTP);
};
