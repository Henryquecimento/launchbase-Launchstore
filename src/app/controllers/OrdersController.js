const Cart = require('../../lib/cart');

const User = require('../models/User');
const Order = require('../models/Order');
const { LoadProduct } = require('../services/LoadProductServices');


const mailer = require('../../lib/mailer');
const { date, formatPrice } = require('../../lib/utils');

const email = (seller, product, buyer) => `
<h3>Olá ${seller.name}</h3>
<p>Você tem um novo pedido do seguinte produto:</p>
<p><br/></p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formattedPrice}</p>
<p>Quantidade disponível: ${product.quantity}</p>
<p><br/><br/></p>
<h3>Dados Do Comprador:</h3>
<p>Nome: ${buyer.name}</p>
<p>Email: ${buyer.email}</p>
<p>Endereço: ${buyer.address}</p>
<p>CEP: ${buyer.cep}</p>
<p><br/><br/></p>
<p><strong>Entre em contato com o comprador para finalizar a compra e fornecer demais informações.</strong></p>
<p><br/><br/></p>
`;

module.exports = {
  async index(req, res) {
    let orders = await Order.findAll({ where: { buyer_id: req.session.userId } });

    const getOrdersPromise = orders.map(async order => {

      // Detail Products
      order.product = await LoadProduct.load('products', { where: { id: order.product_id } });

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

    });

    orders = await Promise.all(getOrdersPromise);

    return res.render('order/index', { orders });

  },
  async post(req, res) {
    try {

      let cart = Cart.init(req.session.cart);
      const buyer_id = req.session.userId;

      const filteredItems = cart.items.filter(item =>
        item.product.user_id != buyer_id
      );

      const ordersPromise = filteredItems.map(async item => {
        let { product, price: total, quantity } = item;
        const { price, id: product_id, user_id: seller_id } = product;
        const status = 'open';

        const order = await Order.create({
          seller_id,
          buyer_id,
          product_id,
          price,
          quantity,
          total,
          status
        });

        //find product data
        product = await LoadProduct.load('product', {
          where: {
            id: product_id
          }
        });

        //find seller data
        const seller = await User.findOne({
          where: { id: seller_id }
        });

        //find buyer data
        const buyer = await User.findOne({
          where: { id: buyer_id }
        });

        //send email to seller about the order
        await mailer.sendMail({
          to: seller.email,
          from: 'no-reply@launchstore.com.br',
          subject: 'Você Tem Um Novo Pedido',
          html: email(seller, product, buyer)
        });


        return order;
      })

      await Promise.all(ordersPromise);

      /* Clean Cart */
      delete req.session.cart;
      Cart.init();

      //show a success message to user
      return res.render("orders/success");

    } catch (err) {
      console.error(err);
      return res.render("orders/error");
    }
  }
}