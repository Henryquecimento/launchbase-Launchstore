const fs = require('fs');
const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");
const { formatPrice, date } = require("../../lib/utils");

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
	async show(req, res) {
		const results = await Product.find(req.params.id);
		const product = results.rows[0];

		if (!product) return res.send('Product not found!');

		const { day, month, hour, minutes } = date(product.updated_at);

		product.published = {
			day: `${day}/${month}`,
			hour: `${hour}h${minutes}min`
		}

		product.price = formatPrice(product.price);
		product.old_price = formatPrice(product.old_price);

		return res.render("products/show.njk", { product });
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

			// Add new photos to DB
			if (req.files.length != 0) {
				const newFilesPromise = req.files.map(file =>
					File.create({
						...file,
						product_id: req.body.id
					})
				);

				await Promise.all(newFilesPromise);
			}


			// Remove photos from DB
			if (req.body.removed_files) {
				// 1,2,
				const removedFiles = req.body.removed_files.split(',');
				// ['1', '2', '']
				const lastIndex = removedFiles.length - 1;

				//['1','2']
				removedFiles.splice(lastIndex, 1);

				const removedFilesPromise = removedFiles.map(id => File.delete(id));

				await Promise.all(removedFilesPromise);
			}

			req.body.price = req.body.price.replace(/\D/g, ""); // It'll clean the formated number

			if (req.body.old_price != req.body.price) {
				const oldProduct = await Product.find(req.body.id);

				req.body.old_price = oldProduct.rows[0].price;
			}

			await Product.update(req.body);

			return res.redirect(`/products/${req.body.id}`);
		} catch (err) {
			throw new Error(err);
		}
	},
	async delete(req, res) {
		try {
			const results = await Product.files(req.body.id);
			const files = results.rows;

			for (file of files) {
				fs.unlinkSync(file.path);
			}

			await Product.delete(req.body.id);

			return res.redirect("/products/create");
		} catch (err) {
			throw new Error(err);
		}
	},
};
