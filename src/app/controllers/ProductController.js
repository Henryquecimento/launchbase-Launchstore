const Category = require("../models/Category");
const Product = require("../models/Product");
const { formatPrice } = require("../../lib/utils");

module.exports = {
	create(req, res) {
		// Taking the categories
		Category.all()
			.then((results) => {
				const categories = results.rows;

				return res.render("products/create.njk", { categories });
			})
			.catch((err) => {
				throw new Error(err);
			});
	},
	async post(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (key of keys) {
				if (req.body[key] == "") {
					return res.send("Please, You must fill all the fields up!");
				}
			}

			const results = await Product.create(req.body);
			const productId = results.rows[0].id;

			return res.redirect(`/products/${productId}`);
		} catch (err) {
			throw new Error(err);
		}
	},

	async edit(req, res) {
		try {
			let results = await Product.find(req.params.id);
			const product = results.rows[0];

			if (!product) return res.send("Product not found!");

			product.old_price = formatPrice(product.old_price);
			product.price = formatPrice(product.price);

			results = await Category.all();
			const categories = results.rows;

			return res.render("products/edit.njk", { product, categories });
		} catch (err) {
			throw new Error(err);
		}
	},

	async put(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (key of keys) {
				if (req.body[key] == "") {
					return res.send("Please, You must fill all the fields up!");
				}
			}

			req.body.price = req.body.price.replace(/\D/g, ""); // It'll clean the formated number

			if (req.body.old_price != req.body.price) {
				const oldProduct = await Product.find(req.body.id);

				req.body.old_price = oldProduct.rows[0].price;
			}

			await Product.update(req.body);

			return res.redirect(`/products/${req.body.id}/edit`);
		} catch (err) {
			throw new Error(err);
		}
	},
	async delete(req, res) {
		try {
			await Product.delete(req.body.id);

			return res.redirect("/products/create");
		} catch (error) {
			throw new Error(err);
		}
	},
};
