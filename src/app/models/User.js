const db = require('../../config/db');

module.exports = {
    async findOne(filters) {
        let query = `SELECT * FROM users`;


        Object.keys(filters).map(key => {
            //SELECT * FROM users

            query = `
            ${query}
            ${key}`  //WHERE -> key

            //field -> email or cpf_cnpj
            Object.keys(filters[key]).map(field => {
                query = `
                    ${query}
                    ${field} = '${filters[key][field]}'`
            }); //filters[key] -> 'where:' or 'or:'  
        });

        const results = await db.query(query);

        return results.rows[0];
    }
}