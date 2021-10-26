const express = require("express");
const routes = express.Router();

const OrdersController = require('../app/controllers/OrdersController');

const { onlyUsers } = require("../app/middlewares/session");

// --- login/logout
routes.post('/', onlyUsers, OrdersController.post);

module.exports = routes;