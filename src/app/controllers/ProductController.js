const { unlinkSync } = require('fs');

const Category = require("../models/Category");
const Product = require("../models/Product");
const File = require("../models/File");

const fs = require('fs');
const { formatPrice, date } = require("../../lib/utils");
const { LoadProduct } = require('../services/LoadProductServices');

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

			const filesPromise = req.files.map(file =>
				File.create({
					name: file.filename,
					path: file.path,
					product_id
				})
			);

			await Promise.all(filesPromise);

			return res.redirect(`/products/${product_id}/edit`);
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
	},
	async show(req, res) {
		try {
			let product = await LoadProduct.load('product', { where: { id: req.params.id } })

			if (!product) return res.send('Product not found!');

			return res.render("products/show", { product });
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
	},
	async edit(req, res) {
		try {
			let product = await LoadProduct.load('product', { where: { id: req.params.id } })

			if (!product) return res.send("Product not found!");

			const categories = await Category.findAll();

			return res.render("products/edit", { product, categories });
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
						name: file.filename,
						path: file.path,
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
					const file = await File.find(id)

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

			await Product.delete(req.body.id);

			files.map(file => {
				try {
					unlinkSync(file.path);

				} catch (err) {
					console.error(err);
				}
			});

			return res.redirect("/products/create");
		} catch (err) {
			throw new Error(err);
		}
	},
};
