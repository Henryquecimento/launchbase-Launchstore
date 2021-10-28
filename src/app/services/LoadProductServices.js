
const { formatPrice, date } = require("../../lib/utils");

const Product = require("../models/Product");

async function getImages(productId) {
  let files = await Product.files(productId);

  files = files.map(file => ({
    ...file,
    path: file.path.replace(/\\/g, '/'),
    src: `${file.path.replace("public", "")}`
  }));

  return files;
}

async function format(product) {

  const files = await getImages(product.id);

  if (files[0] != undefined) {
    product.img = files[0].src;
  } else {
    product.img = null;
  }

  product.files = files;
  product.formattedOldPrice = formatPrice(product.old_price);
  product.formattedPrice = formatPrice(product.price);

  const { day, month, hour, minutes } = date(product.updated_at);

  product.published = {
    day: `${day}/${month}`,
    hour: `${hour}h${minutes}min`
  }

  return product;
}

const LoadProduct = {
  load(service, filters) {
    this.filters = filters;

    return this[service]();
  },
  async product() {
    try {
      let product = await Product.findOne(this.filters);

      return format(product);

    } catch (err) {
      console.error(err);
    }
  },
  async products() {
    try {
      let products = await Product.findAll(this.filters);

      const productsPromise = products.map(format); // this form is the same as 'product.map(product => format(product));'

      return Promise.all(productsPromise);

    } catch (err) {
      console.error(err);
    }
  },
  async productWithDeleted() {
    try {
      const product = await Product.findOneWithDeleted(this.filters);

      return format(product);

    } catch (err) {
      console.error(err);
    }
  },
  format,
}

module.exports = {
  LoadProduct
}