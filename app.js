const mongoose = require('mongoose');
const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const passport = require('passport');
require('./controllers/auth');
const authController = require('./controllers/authController');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const cors = require('cors');
app.use(
  cors({
    credentials: true,
  })
);

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
    results: User.length,
    data: {
      User,
    },
  });
});

app.post('/api/users/signup', authController.signup);
app.post('/api/users/login', authController.login);

//Update user info
// app.post(
//   '/api/users',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     users.push(req.body);
//     fs.writeFile(`${__dirname}/users.json`, JSON.stringify(users), (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           users,
//         },
//       });
//     });
//   }
// );

app.get(
  '/api/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = User.findOne((el) => el.username === req.params.username);
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
  }
);

//update user details
app.patch(
  '/api/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = User.findOne((el) => el.username === req.params.username);
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
  }
);

app.patch(
  '/api/users/:username/films/:filmid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const filmIdToAdd = req.params.filmid;

      const user = await User.findOneAndUpdate(
        { username: req.params.username },
        { $addToSet: { favouriteFilms: filmIdToAdd } },
        { new: true, upsert: true }
      );

      if (!user) {
        return res.status(404).json({
          status: 'Error',
          message: 'Username does not exist',
        });
      }

      res.status(200).json({
        status: 'success',
        message: user.favouriteFilms.includes(filmIdToAdd)
          ? 'Film is already in favorites'
          : 'Film has been added',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }
);

app.delete(
  '/api/users/:username',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findOneAndDelete({
        username: req.params.username,
      });
      if (!user) {
        return res.status(404).json({
          status: 'Error',
          message: 'Username does not exist',
        });
      }
      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
  }
);

app.delete(
  '/api/users/:username/films/:filmid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = User.findOneAndUpdate(
      { username: req.params.username },
      {
        $pull: { favouriteFilms: req.params.filmid },
      },
      { new: true }
    );

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
  }
);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// Connect locally to mongodb
// mongodb://localhost:27017/film-finder
