import * as Expense from '../models/expense.js';
import * as Category from '../models/category.js';

export const createExpense = async (req, res) => {
  const userId = req.userId;

  const category = await Category.findByName(userId, req.body.category);

  if (!category) {
    return res.status(400).json({success: false, error: "Invalid category"});
  }

  const expenseId = await Expense.createExpense({
    user_id: req.userId,
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    description: req.body.description
  });

  res.status(201).json({
    success: true,
    message: "Expense added successfully",
    expenseId
  });

};

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.getExpenses(req.userId, req.query);
    res.json({success: true, expenses});
  } catch (err) {
    next(err);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.getExpenseById(req.params.id);

    if (!expense) return res.status(404).json({success: false, error: "Not found"});

    if (expense.user_id !== req.userId) {
      return res.status(403).json({success: false, error: "Forbidden"});
    }

    res.json({success: true, expense});
  } catch (err) {
    next(err);
  }
};

export const updateExpense = async (req, res, next) => {

  try {
    const expense = await Expense.getExpenseById(req.params.id);

    if (!expense || expense.user_id !== req.userId)
      return res.status(403).json({success: false, error: "Forbidden"});

    await Expense.updateExpense(req.params.id, req.body);

    res.json({success: true, message: "Expense updated successfully"});
  } catch (err) {
    next(err);
  }
};

export const deleteExpense = async (req, res, next) => {
    const expense = await Expense.getExpenseById(req.params.id);

    if (!expense || expense.user_id !== req.userId){
      return res.status(403).json({success: false, error: "Forbidden"});
    }

    await Expense.deleteExpense(req.params.id);

    res.json({success: true, message: "Expense deleted successfully"});

};
