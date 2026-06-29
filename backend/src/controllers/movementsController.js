const db = require('../config/db');

const tiposValidos = ['entrada', 'salida'];

const createMovement = async (req, res, next) => {
  const { item_id, cantidad, tipo_movimiento, nota } = req.body;

  if (!item_id || cantidad == null || !tipo_movimiento) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: item_id, cantidad, tipo_movimiento' });
  }
  if (typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({ error: 'cantidad debe ser un numero positivo' });
  }
  if (!tiposValidos.includes(tipo_movimiento)) {
    return res.status(400).json({ error: 'tipo_movimiento debe ser "entrada" o "salida"' });
  }

  try {
    const cantidadFinal = tipo_movimiento === 'salida' ? -cantidad : cantidad;

    const query = `
      INSERT INTO movimientos (item_id, cantidad, tipo_movimiento, nota)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(query, [item_id, cantidad, tipo_movimiento, nota || null]);

    await db.query(
      'UPDATE items SET stock_actual = stock_actual + $1 WHERE id = $2',
      [cantidadFinal, item_id]
    );

    res.json({ mensaje: 'Movimiento registrado y stock actualizado', movimiento: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const testDb = async (req, res, next) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.send('Conexion exitosa! La hora de la base de datos es: ' + result.rows[0].now);
  } catch (err) {
    next(err);
  }
};

module.exports = { createMovement, testDb };
