const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');

app.use(morgan('dev'));

app.use(express.json());

const films = JSON.parse(fs.readFileSync(`${__dirname}/films.json`));

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//get all films
app.get('/api/films/', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: films.length,
    data: {
      films,
    },
  });
});

//get films by id
app.get('/api/films/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > films.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  const film = films.find((el) => el.id === id);

  res.status(200).json({
    status: 'Success',
    data: {
      film,
    },
  });
});

//get films by genre
app.get('/api/films/genre/:name', (req, res) => {
  const genre = films.find(
    (films) => films.Genre.Name === req.params.name
  ).Genre;

  if (!genre) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Genre not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      genre,
    },
  });
});

//get director
app.get('/api/films/director/:name', (req, res) => {
  const director = films.filter(
    (films) => films.Director.Name === req.params.name
  );

  if (!director) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Director not found',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      director,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// TODO: first letter capitalise for user input
