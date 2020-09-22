const express = require('express');
const controllerAuth = require('../controllers/auth');
const controllerUsers = require('../controllers/users');
const controllerNews = require('../controllers/news');
const controllerChat = require('../controllers/chat');

const router = express.Router();

router.post('/registration',controllerAuth.registration);
router.post('/login', controllerAuth.login);
router.post('/refresh-token', controllerAuth.refreshToken);

module.exports = router;