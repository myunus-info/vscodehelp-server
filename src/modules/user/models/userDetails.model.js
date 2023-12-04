const mongoose = require('mongoose');

const UserDetailSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name!'],
  },
  address: {
    type: String,
    required: [true, 'Please provide your address!'],
  },
  state: {
    type: String,
    required: [true, 'Please provide your state!'],
  },
  zipCode: {
    type: String,
    required: [true, 'Please provide your zip code'],
  },
  city: {
    type: String,
    required: [true, 'Please provide your city!'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('UserDetail', UserDetailSchema);
