const express = require("express");
const routes = express.Router();

const SessionController = require('../app/controllers/SessionController');
const UserController = require('../app/controllers/UserController');
const UserValidations = require('../app/validators/user');
const SessionValidations = require('../app/validators/session');
const { isLoggedRedirectToUsers, onlyUsers } = require("../app/middlewares/session");

// --- login/logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);
routes.post('/login', SessionValidations.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// --- reset password/ forgot
// routes.get('/forgot-password', SessionController.forgotForm);
// routes.get('/password-reset', SessionController.resetForm);
// routes.post('/forgot-password', SessionController.forgot);
// routes.post('/password-reset', SessionController.reset);

// --- User Register UserController 
routes.get('/register', UserController.registerForm);
routes.post('/register', UserValidations.post, UserController.post);

routes.get('/', onlyUsers, UserValidations.show, UserController.show);
routes.put('/', UserValidations.update, UserController.update);
//routes.delete('/', UserController.delete);

module.exports = routes;