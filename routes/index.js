import { Router } from 'express';

import users from "./users.js";
import category from "./category.js";
import expense from "./expense.js";
import analytics from "./analytics.js";

const router = Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express NODE 2',
    userName: 'Valod',
  });
});

router.use('/users', users);
router.use('/category', category);
router.use('/expenses', expense);
router.use('/analytics', analytics);
export default router;
