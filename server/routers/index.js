const express = require('express');
const controllerAuth = require('../controllers/auth');
const controllerUsers = require('../controllers/users');
const controllerNews = require('../controllers/news');
const controllerChat = require('../controllers/chat');

const router = express.Router();

router.post('/registration',controllerAuth.registration);
router.post('/login', controllerAuth.login);
router.post('/refresh-token', controllerAuth.refreshToken);

router.get('/profile',controllerAuth.auth,controllerUsers.getProfile);
router.patch('/profile',controllerAuth.auth,controllerUsers.patchProfile);
router.get('/users',controllerAuth.auth,controllerUsers.getUsers);
router.delete('/users/:id',controllerAuth.auth,controllerUsers.delUser);
router.patch('/users/:id/permission',controllerAuth.auth,controllerUsers.patchPermissionUser);

router.get('/news',controllerAuth.auth,controllerNews.getAllNews);
router.post('/news',controllerAuth.auth,controllerNews.createNews);
router.patch('/news/:id',controllerAuth.auth,controllerNews.patchNews);
router.delete('/news/:id',controllerAuth.auth,controllerNews.deleteNews);

module.exports = router;