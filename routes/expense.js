import express from 'express';
import {
  // getExpenses,
  // getExpenseById,
  // updateExpense,
  createExpense
} from '../controllers/expense.js';
import {validation} from "../middlewares/validation.js";
import authorize from "../middlewares/authorize.js";
import schema from "../schemas/expenseSchema.js";
const router = express.Router();


router.post('/',
  authorize,
  validation(schema.createExpense),
  createExpense
);

//
// router.get('/',
//   authorize,
//   getExpenses);
//
// router.get('/:id',
//   authorize,
//   getExpenseById);
//
// router.put('/:id',
//   authorize,
//   validation(schema.updateExpense),
//   updateExpense);
//
// router.delete('/:id',
//   authorize,
//   deleteExpense);

export default router;









