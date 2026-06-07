import express from 'express';
import auth from '../middleware/auth.js';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getExpenseStats,
} from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', auth, createExpense);
router.get('/', auth, getExpenses);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);
router.get('/stats', auth, getExpenseStats);

export default router;
