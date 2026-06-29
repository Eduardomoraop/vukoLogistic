const db = require('../config/db');

const getItems = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getItems };
