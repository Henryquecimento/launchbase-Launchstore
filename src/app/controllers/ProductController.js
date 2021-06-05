const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");
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

			if (req.files.length == 0) {
				return res.send('Please, send at least one image');
			}

			const results = await Product.create(req.body);
			const productId = results.rows[0].id;

			const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }));

			await Promise.all(filesPromise);

			return res.redirect(`/products/${productId}/edit`);
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

			// Get Categories
			results = await Category.all();
			const categories = results.rows;

			// GET Files
			results = await Product.files(req.params.id);
			let files = results.rows; // ARRAY
			files = files.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
			}))

			return res.render("products/edit.njk", { product, categories, files });
		} catch (err) {
			throw new Error(err);
		}
	},

	async put(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (key of keys) {
				if (req.body[key] == "" && key != 'removed_files') {
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
