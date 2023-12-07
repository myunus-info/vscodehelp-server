const userController = require('./user.controller');
const AuthStrategy = require('./user.authentication.middleware');

module.exports = app => {
  app.post('/api/users/register', userController.register);
  app.post('/api/users/login', userController.login);
  app.post('/api/users/verify-otp', AuthStrategy, userController.verifyOTP);
  app.post('/api/users/create-user-details', AuthStrategy, userController.registerUserDetails);
};
