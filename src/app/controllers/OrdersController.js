const Cart = require('../../lib/cart');

const User = require('../models/User');
const Order = require('../models/Order');
const { LoadProduct } = require('../services/LoadProductServices');


const mailer = require('../../lib/mailer');

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