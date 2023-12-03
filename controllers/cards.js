const cardModel = require ('../models/card');

function readAllCards(req, res) {
  return cardModel.find()
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch ((err) => {
      return res.status(500).send({message: "Ошибка сервера"});
    })
};

function createCard(req, res) {
  const cardData = req.body;
  cardData.owner = req.user._id;

  return cardModel.create(cardData)
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: "Переданы некорректные данные при создании карточки"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })
};


function deleteCard(req, res) {
  return cardModel.findOneAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      return res.status(500).send({message: "Ошибка сервера"});
    })

};

function putLike(req, res) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },)
    .then((card) => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({message: "Переданы некорректные данные для постановки/снятии лайка"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })

};

function deleteLike(req, res) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: "Переданы некорректные данные для постановки/снятии лайка"});
      }
      return res.status(500).send({message: "Ошибка сервера"});
    })

};

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike
}