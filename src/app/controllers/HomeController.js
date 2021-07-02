const { formatPrice } = require("../../lib/utils");

const Product = require("../models/Product");
const File = require("../models/File");

module.exports = {
  async index(req, res) {

    let results = await Product.all();
    const products = results.rows;


    if (!product) return res.send('Products not found!');


    return res.render()
  }

}