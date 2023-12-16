const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const mongoose = require('mongoose');

const app = express();
const middlewareAuth = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const userController = require('./controllers/users');
const { handleError } = require('./middlewares/errors/handleError');
const { regEx } = require('./utils/regEx');

app.use(express.json());
app.use(helmet());
app.use(cookieParser());

mongoose.connect(DB_URL)
  .then(() => {
    console.log('mongoDB connected');
  });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userController.login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regEx),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), userController.createUser);

app.use(middlewareAuth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
