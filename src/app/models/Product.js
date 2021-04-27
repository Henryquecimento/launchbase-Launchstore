const db = require('../../config/db');

module.exports = {
    create(data) {
        const query = `
            INSERT INTO products (
                category_id,
                user_id,
                name,
                description,
                old_price,
                price,
                quantity,
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`;
        
        //R$1,00
        data.price = data.price.replace(/\D/g, "");
        //100

        const values = [
            data.category_id,
            data.user_id || 1,
            data.name,
            data.description,
            data.old_price || data.price,
            data.price,
            data.quantity || 1,
            data.status,
        ];


        return db.query(query, values);
    }
}
