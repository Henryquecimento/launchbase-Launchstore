
const { formatPrice, date } = require("../../lib/utils");

const Order = require("../models/Order");
const User = require("../models/User");

const { LoadProduct } = require('./LoadProductServices');

async function format(order) {

  // Detail Products
  order.product = await LoadProduct.load('product', { where: { id: order.product_id } });

  //Detail Buyer
  order.buyer = await User.findOne({
    where: { id: order.buyer_id }
  });

  //Detail Seller
  order.seller = await User.findOne({
    where: { id: order.seller_id }
  });

  //Price Formatation
  order.formattedPrice = formatPrice(order.price);
  order.formattedTotal = formatPrice(order.total);

  //Status Formatation
  const statuses = {
    open: 'Aberto',
    sold: 'Vendido',
    canceled: 'Cancelado'
  }

  order.formattedStatus = statuses[order.status]; //statuses.open

  // Updated_at in Formatation
  const updatedAt = date(order.updated_at);
  order.formattedUpdatedAt = `${order.formattedStatus} em ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} às ${updatedAt.hour}h${updatedAt.minutes}min`;

  return order;

}

const LoadOrder = {
  load(service, filters) {
    this.filters = filters;

    return this[service]();
  },
  async order() {
    try {
      const order = await Order.findOne(this.filters);

      return format(order);

    } catch (err) {
      console.error(err);
    }
  },
  async orders() {
    try {

      const orders = await Order.findAll(this.filters);

      const ordersPromise = orders.map(format);

      return Promise.all(ordersPromise);

    } catch (err) {
      console.error(err);
    }
  },
  format,
}

module.exports = {
  LoadOrder
}