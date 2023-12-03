const userModel = require ('../models/user');

function readAllUsers(req, res) {
  return userModel.find()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch ((err) => {
      return res.status(500).send({message: "Ошибка сервера"});
    })
};

function readUser(req, res) {
  const userId  = req.params.id;
  console.log(userId);
  return userModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: "Пользователь не найден"});
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: "Переданы некорректные данные пользователя"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })

};

function createUser(req, res) {
  const userData = req.body;
  return userModel.create(userData)
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: "Переданы некорректные данные при создании пользователя"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })
};

function patchProfile(req, res) {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: "Пользователь не найден"});
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: "Переданы некорректные данные при обновлении профиля"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })
};

function patchAvatar(req, res) {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({message: "Пользователь не найден"});
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: "Переданы некорректные данные при обновлении профиля"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })
};

module.exports = {
  readAllUsers,
  readUser,
  createUser,
  patchProfile,
  patchAvatar
}