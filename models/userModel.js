const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide your name'] },
  username: { type: String, required: true, unique: true },
  birthday: Date,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, //wont show up in the output
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //This hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Deletes the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
