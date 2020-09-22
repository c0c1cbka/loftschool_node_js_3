const express = require('express');
const controllerUsers = require('../controllers/users');
const controllerNews = require('../controllers/news');
const controllerChat = require('../controllers/chat');

const router = express.Router();

router.post('/login', controllerUsers.login);

module.exports = router;