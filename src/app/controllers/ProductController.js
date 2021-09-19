const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

const fs = require('fs');
const { formatPrice, date } = require("../../lib/utils");

module.exports = {
	async create(req, res) {
		try {
			const categories = await Category.findAll();

			return res.render("products/create", { categories });

		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
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

			let { category_id, user_id, name, description, old_price, price, quantity, status } = req.body;

			price = price.replace(/\D/g, "");

			user_id = req.session.userId;

			const product_id = await Product.create({
				category_id,
				user_id,
				name,
				description,
				old_price: old_price || price,
				price,
				quantity,
				status: status || 1,
			});

			const filesPromise = req.files.map(file => File.create({ ...file, product_id }));

			await Promise.all(filesPromise);

			return res.redirect(`/products/${product_id}/edit`);
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
	},
	async show(req, res) {
		try {
			let product = await Product.find(req.params.id);

			if (!product) return res.send('Product not found!');

			const { day, month, hour, minutes } = date(product.updated_at);

			product.published = {
				day: `${day}/${month}`,
				hour: `${hour}h${minutes}min`
			}

			product.price = formatPrice(product.price);
			product.old_price = formatPrice(product.old_price);

			let files = await Product.files(product.id);
			files = files.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
			}));

			return res.render("products/show", { product, files });
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
	},
	async edit(req, res) {
		try {
			let product = await Product.find(req.params.id);

			if (!product) return res.send("Product not found!");

			product.old_price = formatPrice(product.old_price);
			product.price = formatPrice(product.price);

			const categories = await Category.findAll();

			let files = await Product.files(req.params.id);

			files = files.map(file => ({
				...file,
				src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
			}))

			return res.render("products/edit", { product, categories, files });
		} catch (err) {
			console.error(err);
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

				const removedFilesPromise = removedFiles.map(async id => {
					const result = await File.find(id)
					const file = result.rows[0];

					fs.unlinkSync(file.path);

					return File.delete(id)
				});

				await Promise.all(removedFilesPromise);
			}

			req.body.price = req.body.price.replace(/\D/g, ""); // It'll clean the formated number

			if (req.body.old_price != req.body.price) {
				const oldProduct = await Product.find(req.body.id);

				req.body.old_price = oldProduct.price;
			}

			await Product.update(req.body.id, {
				category_id: req.body.category_id,
				name: req.body.name,
				description: req.body.description,
				old_price: req.body.old_price,
				price: req.body.price,
				quantity: req.body.quantity,
				status: req.body.status,
			});

			return res.redirect(`/products/${req.body.id}`);
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
	},
	async delete(req, res) {
		try {
			const files = await Product.files(req.body.id);

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
