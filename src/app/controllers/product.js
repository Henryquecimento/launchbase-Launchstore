const Category = require('../models/Category');

module.exports = {
    create(req, res) {
        // Taking the categories
        Category.all()
            .then((results) => {

                const categories = results.rows;

                return res.render('products/create.njk', { categories });
            }).catch((err) => {
                throw new Error(err);
            });


    },
    post(req, res) {

    }
}