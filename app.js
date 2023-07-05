const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

const cors = require('cors');
app.use(cors());

const Film = require('./models/filmModel');

app.use(morgan('dev'));

app.use(express.json());

const port = process.env.port || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      //   'mongodb://localhost:27017/film-finder' //local hosting
      process.env.MONGO_URI
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(port, () => {
    console.log('listening for requests');
  });
});

//accesses local json file
// const films = JSON.parse(fs.readFileSync(`${__dirname}/films.json`));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//get all films
app.get('/api/films/', async (req, res) => {
  try {
    const films = await Film.find();

    res.status(200).json({
      status: 'Success',
      results: films.length,
      data: {
        films,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: 'Error',
      message: error,
    });
  }
});

//get films by id
// TODO maybe change to title
app.get('/api/films/:id', async (req, res) => {
  try {
    const films = await Film.findById(req.params.id);

    res.status(200).json({
      status: 'Success',
      data: {
        films,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: 'Error',
      message: error,
    });
  }
});

//get films by genre
app.get('/api/films/genre/:name', async (req, res) => {
  try {
    const genre = await Film.find({ 'Genre.Name': req.params.name });

    res.status(200).json({
      status: 'Success',
      data: {
        genre,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: 'Error',
      message: error,
    });
  }
});

//get films by director
app.get('/api/films/director/:name', async (req, res) => {
  try {
    const director = await Film.find({ 'Director.Name': req.params.name });

    res.status(200).json({
      status: 'Success',
      data: {
        director,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      status: 'Error',
      message: error,
    });
  }
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// TODO: first letter capitalise for user input
// TODO Validating data
// TODO: Add users
// Connect locally to mongodb
// mongodb://localhost:27017/film-finder
