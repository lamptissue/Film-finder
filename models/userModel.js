const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  birthday: String,
  email: { type: String, required: true },
  favouriteFilms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
