const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A full name is required!'],
  },
  lastName: {
    type: String,
    required: [true, 'A full name is required'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
  },
  registerToken: String,
  registerTokenExpires: Date,
  active: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.createRegistrationToken = function () {
  const registerToken = crypto.randomBytes(32).toString('hex');

  this.registerToken = crypto.createHash('sha256').update(registerToken).digest('hex');

  //console.log({ registerToken }, this.registerToken);
  return registerToken;
};

const User = mongoose.model('users', userSchema);
module.exports = User;
