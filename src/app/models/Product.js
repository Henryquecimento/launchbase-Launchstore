const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'products' });

module.exports = {
    ...Base,
    files(id) {
        return db.query(`SELECT * FROM files WHERE product_id = ${id}`);
    },
    async search(params) {
        const { filter, category } = params;

        let query = '',
            filterQuery = `WHERE`;

        if (category) {
            filterQuery = `
                ${filterQuery}
                products.category_id = ${category}
                AND
            `
        }

        filterQuery = `
            ${filterQuery}
            products.name ilike '%${filter}%'
        `;


        query = `
            SELECT products.*, 
                categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}
        `;

        const results = await db.query(query);
        return results.rows;
    }
}