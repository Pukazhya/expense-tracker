const express = require('express');
const Expense = require('../models/Expense');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function validateExpense(body) {
  const { amount, category, description = '', expenseDate } = body;
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0 || !category?.trim() || !expenseDate) return 'Amount, category, and date are required; amount must be greater than zero';
  const date = new Date(expenseDate);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  if (Number.isNaN(date.getTime()) || date > endOfToday) return 'Expense date cannot be in the future';
  if (description.length > 500) return 'Description cannot exceed 500 characters';
}

router.get('/', async (req, res, next) => {
  try { res.json(await Expense.find({ user: req.user._id }).sort({ expenseDate: -1, createdAt: -1 })); } catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const error = validateExpense(req.body); if (error) return res.status(400).json({ message: error });
    const expense = await Expense.create({ ...req.body, amount: Number(req.body.amount), category: req.body.category.trim(), user: req.user._id });
    res.status(201).json(expense);
  } catch (error) { next(error); }
});

router.post('/batch', async (req, res, next) => {
  try {
    const { expenses } = req.body;
    if (!Array.isArray(expenses) || expenses.length === 0) return res.status(400).json({ message: 'Add at least one expense' });
    if (expenses.length > 100) return res.status(400).json({ message: 'A batch can contain at most 100 expenses' });
    for (const expense of expenses) {
      const error = validateExpense(expense);
      if (error) return res.status(400).json({ message: error });
    }
    const savedExpenses = await Expense.insertMany(expenses.map((expense) => ({ ...expense, amount: Number(expense.amount), category: expense.category.trim(), user: req.user._id })));
    res.status(201).json(savedExpenses);
  } catch (error) { next(error); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const error = validateExpense(req.body); if (error) return res.status(400).json({ message: error });
    const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { ...req.body, amount: Number(req.body.amount), category: req.body.category.trim() }, { new: true, runValidators: true });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.status(204).send();
  } catch (error) { next(error); }
});

module.exports = router;
