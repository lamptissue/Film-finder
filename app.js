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

app.get('/api/films/', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: films.length,
    data: {
      films,
    },
  });
});

app.get('/api/films/:title', (req, res) => {
  const title = films.find((film) => film.Title === req.params.title);

  if (!title) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Film',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      title,
    },
  });
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
