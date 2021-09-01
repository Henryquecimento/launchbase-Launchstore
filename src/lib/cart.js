const { formatPrice } = require('./utils');

const Cart = {
  init(oldCart) {
    if (oldCart) {
      this.items = oldCart.items;
      this.total = oldCart.total;
    } else {
      this.items = [],
        this.total = {
          quantity: 0,
          price: 0,
          formatedPrice: formatPrice(0)
        }
    }
    return this;
  },
  addOne(product) {

    let inCart = this.items.find(item => item.product.id == product.id);

    if (!inCart) {
      inCart = {
        product: {
          ...product,
          formatedPrice: formatPrice(product.price)
        },
        quantity: 0,
        price: 0,
        formatedPrice: formatPrice(0)
      }

      this.items.push(inCart);
    }

    if (inCart.quantity >= product.quantity) return this;

    // add product in cart
    inCart.quantity++;
    inCart.price = inCart.quantity * inCart.product.price;
    inCart.formatedPrice = formatPrice(inCart.price);

    // update quantity
    this.total.quantity++;
    this.total.price += inCart.product.price;
    this.total.formatedPrice = formatPrice(this.total.price);

    return this;

  },
  removeOne(productId) {

    const inCart = this.items.find(item => item.product.id == productId);

    if (!inCart) return this;

    // update product
    inCart.quantity--;
    inCart.price = inCart.product.price * inCart.quantity;
    inCart.formatedPrice = formatPrice(inCart.price);

    // update cart
    this.total.quantity--;
    this.total.price -= inCart.product.price;
    this.total.formatedPrice = formatPrice(this.total.price);

    if (inCart.quantity < 1) {
      this.items = this.items.filter(item => item.product.id != inCart.product.id);

      return this;
    }

    return this;
  },
  delete(productId) { },
}

const product = {
  id: 1,
  price: 199,
  quantity: 2
}

const product2 = {
  id: 2,
  price: 299,
  quantity: 1
}

console.log('first')
let oldCart = Cart.init().addOne(product)
console.log(oldCart)

console.log('second')
oldCart = Cart.init(oldCart).addOne(product)
console.log(oldCart)

console.log('third')
oldCart = Cart.init(oldCart).addOne(product2)
console.log(oldCart)

console.log('remove')
oldCart = Cart.init(oldCart).removeOne(product.id)
console.log(oldCart)

console.log('remove')
oldCart = Cart.init(oldCart).removeOne(product.id)
console.log(oldCart)

console.log('remove')
oldCart = Cart.init(oldCart).removeOne(product2.id)
console.log(oldCart)



module.exports = Cart;