import * as categoryService from '../models/category.js';

export const getUserCategories = async (req, res, next) => {
  try {
    const userId = req. userId;

    const categories = await categoryService.getUserCategories(userId);
    res.json({success: true, categories});
  } catch (err) {
    next(err);
  }
};


export const createCategory = async (req, res, next) => {
  try {
    const userId = req.userId;

    const { color, name } = req.body;

    const existing = await categoryService.findByName(userId, name.trim());
    if (existing) {
      return res.status(400).json({ success: false, error: 'Category already exists' });
    }

    const categoryId = await categoryService.createCategory(userId, name.trim(), color);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      categoryId
    });
  } catch (err) {
    next(err);
  }
};

