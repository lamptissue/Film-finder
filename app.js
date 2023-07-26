const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

const cors = require('cors');
app.use(cors());

const Film = require('./models/filmModel');
const User = require('./models/userModel');

app.use(morgan('dev'));

app.use(express.json());

const port = process.env.port || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb://localhost:27017/film-finder' //local hosting
      // process.env.MONGO_URI
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
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`));

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

app.get('/api/users', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users,
    },
  });
});

app.post('/api/users', (req, res) => {
  users.push(req.body);
  fs.writeFile(`${__dirname}/users.json`, JSON.stringify(users), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        users,
      },
    });
  });
});

app.get('/api/users/:username', (req, res) => {
  const user = users.find((el) => el.username === req.params.username);
  if (!user) {
    res.status(404).json({
      status: 'Error',
      message: 'Username does not exist',
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      user,
    },
  });
});

app.patch('/api/users/:username', (req, res) => {
  const user = users.find((el) => el.username === req.params.username);
  if (!user) {
    res.status(404).json({
      status: 'Error',
      message: 'Username does not exist',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      users: 'Updated user here',
    },
  });
});

app.delete('/api/users/:username', (req, res) => {
  const user = users.find((el) => el.username === req.params.username);
  if (!user) {
    res.status(404).json({
      status: 'Error',
      message: 'Username does not exist',
    });
  }
  res.status(201).json({
    status: 'success',
    data: null,
  });
});

app.delete('/api/users/:username/films/:filmid', (req, res) => {
  const user = users.find((el) => el.username === req.params.username);

  if (!user) {
    res.status(404).json({
      status: 'Error',
      message: 'Username does not exist',
    });
  }

  res.status(204).json({
    status: 'success',
    message: 'Film has been removed',
  });
});

//get user
//get user by username
//post new user
//put/patch update user by username info
//post add film to users list of favourite films
//delete film from users favourite films
//delete user profile

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// TODO Validating data
// TODO: Add slugify

// Connect locally to mongodb
// mongodb://localhost:27017/film-finder
