import express from 'express';
import {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  makeTransaction,
  getTransactionsForEnvelope
} from '../controllers/envelopes.controller.js';  

const envelopesRouter = express.Router();

// Obtener todos los sobres
envelopesRouter.get('/', async (req, res, next) => {
  try {
    await getAllEnvelopes(req, res);
  } catch (error) {
    next(error); 
  }
});

// Obtener un sobre específico por su ID
envelopesRouter.get('/:id', async (req, res, next) => {
  try {
    const envelope = await getEnvelopeById(req.params.id);
    res.json(envelope);
  } catch (error) {
    next(error);
  }
});

// Obtener todas las transacciones de un sobre
envelopesRouter.get('/:id/transactions', async (req, res, next) => {
  try {
    const envelopeId = req.params.id;
    const transactions = await getTransactionsForEnvelope(envelopeId);
    res.json({ transactions });
  } catch (error) {
    next(error); 
  }
});

// Crear un nuevo sobre
envelopesRouter.post('/', async (req, res, next) => {
  try {
    const newEnvelope = await createEnvelope(req, res);  
    res.json(newEnvelope);
  } catch (error) {
    next(error);
  }
});

// Realizar una transacción en un sobre
envelopesRouter.post('/:id/transactions', async (req, res, next) => {
  try {
    const newTransaction = await makeTransaction(req, res); 
    res.json(newTransaction);
  } catch (error) {
    next(error);
  }
});

export { envelopesRouter };
