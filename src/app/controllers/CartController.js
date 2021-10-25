const Cart = require('../../lib/cart');

const { LoadProduct } = require('../services/LoadProductServices');

module.exports = {
  async index(req, res) {
    try {

      let { cart } = req.session;

      cart = Cart.init(cart);

      return res.render('cart/index.njk', { cart });
    } catch (err) {
      console.error(err);
    }
  },
  async addOne(req, res) {
    const { id } = req.params;

    let { cart } = req.session;

    const product = await LoadProduct.load('product', {
      where: {
        id
      }
    });

    cart = Cart.init(cart).addOne(product);

    req.session.cart = cart;

    return res.redirect('/cart');

  },
  removeOne(req, res) {
    const { id } = req.params;

    let { cart } = req.session;

    if (!cart) return res.redirect('/cart');

    cart = Cart.init(cart).removeOne(id);

    req.session.cart = cart;

    return res.redirect('/cart');
  },
  delete(req, res) {
    const { id } = req.params;
    let { cart } = req.session;

    if (!cart) return;

    req.session.cart = Cart.init(cart).delete(id);

    return res.redirect('/cart');

  }
}