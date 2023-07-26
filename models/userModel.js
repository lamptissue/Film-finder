const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide your name'] },
  username: { type: String, required: true, unique: true },
  birthday: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  favouriteFilms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
