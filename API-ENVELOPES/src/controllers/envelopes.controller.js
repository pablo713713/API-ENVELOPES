import { pool } from '../db.js'; 

/**
 * Obtener todos los sobres (envelopes)
 */
export const getAllEnvelopes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM envelopes');
    res.json({ envelopes: rows });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los sobres' });
  }
};

/**
 * Obtener un sobre específico por su ID
 */
export const getEnvelopeById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM envelopes WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error(`Sobre con ID ${id} no encontrado`);
    }
    return rows[0];
  } catch (error) {
    throw new Error('Error al obtener el sobre');
  }
};

/**
 * Crear un nuevo sobre (envelope)
 */
export const createEnvelope = async (req, res) => {
  const { name, limit } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO envelopes (name, `limit`, spent) VALUES (?, ?, ?)', [name, limit, 0]);
    const newEnvelope = {
      id: result.insertId,
      name,
      limit,
      spent: 0,
      balance: limit,
    };
    res.status(201).json(newEnvelope);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el sobre' });
  }
};

/**
 * Obtener las transacciones para un sobre
 */
export const getTransactionsForEnvelope = async (envelopeId) => {
  try {
    const [transactions] = await pool.query('SELECT * FROM transactions WHERE envelope_id = ?', [envelopeId]);
    return transactions.length === 0 ? [] : transactions;
  } catch (error) {
    throw new Error('Error al obtener las transacciones para el sobre');
  }
};

/**
 * Realizar una transacción en un sobre
 */
export const makeTransaction = async (req, res) => {
  const { id } = req.params;  
  const { amount, description } = req.body;

  try {
    const [envelope] = await pool.query('SELECT * FROM envelopes WHERE id = ?', [id]);

    if (envelope.length === 0) {
      return res.status(404).json({ message: `Sobre con ID ${id} no encontrado` });
    }

    // Verificar si la transacción excede el límite
    if (parseFloat(envelope[0].spent) + parseFloat(amount) > parseFloat(envelope[0].limit)) {
      return res.status(403).json({ message: 'La transacción excede el límite del sobre' });
    }

    // Realizar la transacción
    const [transactionResult] = await pool.query(
      'INSERT INTO transactions (envelope_id, amount, description, date) VALUES (?, ?, ?, ?)', 
      [id, amount, description, new Date()]
    );

    // Actualizar el monto gastado en el sobre
    await pool.query('UPDATE envelopes SET spent = spent + ? WHERE id = ?', [amount, id]);

    res.status(201).json({
      id: transactionResult.insertId,
      envelope_id: id,
      amount,
      description,
      date: new Date(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al realizar la transacción' });
  }
};

