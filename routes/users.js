const router = require('express').Router();
const userController = require('../controllers/users');

router.patch('/users/me', userController.patchProfile);
router.patch('/users/me/avatar', userController.patchAvatar);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.readUser);
router.get('/users', userController.readAllUsers);


module.exports = router;