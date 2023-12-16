const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors, celebrate } = require('celebrate');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const mongoose = require('mongoose');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const middlewareAuth = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const userController = require('./controllers/users');
const { handleError } = require('./middlewares/errors/handleError');
const NotFoundError = require('./middlewares/errors/NotFoundError');
const { validationRequestSignin, validationRequestSignup } = require('./middlewares/validationRequest');

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(limiter);

mongoose.connect(DB_URL)
  .then(() => {
    console.log('mongoDB connected');
  });

app.post('/signin', celebrate(validationRequestSignin), userController.login);

app.post('/signup', celebrate(validationRequestSignup), userController.createUser);

app.use(middlewareAuth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
