const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

const app = express();
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(()=>{
    console.log('mongoDB connected');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '656ca6a7d8af86720b0ed719'
  };
  next();
});

app.use(cardsRoutes);
app.use(usersRoutes);

app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});