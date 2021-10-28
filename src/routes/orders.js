const express = require("express");
const routes = express.Router();

const OrdersController = require('../app/controllers/OrdersController');

const { onlyUsers } = require("../app/middlewares/session");

routes.post('/', onlyUsers, OrdersController.post);
routes.get('/', onlyUsers, OrdersController.index);
routes.get('/sales', onlyUsers, OrdersController.sales);
routes.get('/:id', onlyUsers, OrdersController.show);
routes.post('/:id/:action', onlyUsers, OrdersController.update);

module.exports = routes;