const Cart = require('../../lib/cart');

const { LoadProduct } = require('../services/LoadProductServices');

module.exports = {
  async index(req, res) {
    try {
      const product = await LoadProduct.load('product', {
        where: {
          id: 1
        }
      })

      let { cart } = req.session;


      cart = Cart.init(cart).addOne(product);

      return res.render('cart/index.njk', { cart });
    } catch (err) {
      console.error(err);
    }
  }
}