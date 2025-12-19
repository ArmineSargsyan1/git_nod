import {Router} from 'express';
import authorize from "../middlewares/authorize.js";
import {validation} from "../middlewares/validation.js";
import schema from "../schemas/categorySchema.js";

import {createCategory, getUserCategories} from "../controllers/category.js";
const router = Router();



router.get('/',
  authorize,
  getUserCategories
);


router.post('/create',
  validation(schema.categorySchema),
  authorize,
  createCategory
);



export default router;



