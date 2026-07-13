const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, trim: true, maxlength: 50 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  expenseDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
