const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, 'Минимальная длина поля "Имя"- 2'],
      maxLength: [30, 'Максимальная длина поля "Имя"- 30'],
      required: [true, 'Поле "Имя" должно быть заполнено'],
    },
    about: {
      type: String,
      minLength: [2, 'Минимальная длина поля "О себе"- 2'],
      maxLength: [30, 'Максимальная длина поля "О себе"- 30'],
      required: [true, 'Поле "О себе" должно быть заполнено'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле "Ссылка на картинку" должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
