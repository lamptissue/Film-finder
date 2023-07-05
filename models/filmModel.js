const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  Title: { type: String, required: true, unique: true },
  Description: { type: String, required: true },
  Date: String,
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: { type: String, required: true },
    Bio: { type: String, required: true },
    Birth: { type: String, required: true },
    Death: String,
  },
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
