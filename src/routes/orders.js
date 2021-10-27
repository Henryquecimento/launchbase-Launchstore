const express = require("express");
const routes = express.Router();

const OrdersController = require('../app/controllers/OrdersController');

const { onlyUsers } = require("../app/middlewares/session");

routes.post('/', onlyUsers, OrdersController.post);
routes.get('/', onlyUsers, OrdersController.index);
routes.get('/sales', onlyUsers, OrdersController.sales);

module.exports = routes;