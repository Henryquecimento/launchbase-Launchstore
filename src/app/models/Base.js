const db = require('../../config/db');

const Base = {
  init({ table }) {
    if (!table) throw new Error("Invalid params!");

    this.table = table;

    return this;
  },
  all() {
    return db.query(`
        SELECT *
        FROM ${this.table}
        ORDER BY updated_at DESC
    `);
  },
  async findOne(filters) {
    try {
      let query = `SELECT * FROM ${this.table}`;

      Object.keys(filters).map(key => {

        query = `
        ${query}
        ${key}`;

        Object.keys(filters[key]).map(field => {
          query = `
          ${query}
          ${field} = '${filters[key][field]}'`
        });
      });

      const results = await db.query(query);

      return results.rows[0];
    } catch (err) {
      console.error(err);
      throw new Error('FindOne method issues');
    }
  },
}

module.exports = Base;