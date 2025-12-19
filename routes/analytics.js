import express from 'express';
import authorize from '../middlewares/authorize.js';
import { totalSpending, spendingByCategory, monthlySummary } from '../controllers/analytics.js';


const router = express.Router();

router.get('/total', authorize, totalSpending);
router.get('/by-category', authorize, spendingByCategory);
router.get('/monthly', authorize, monthlySummary);

export default router;
