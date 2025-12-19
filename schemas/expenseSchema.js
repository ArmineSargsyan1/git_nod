import joi from "joi";

export default {
  createExpense: {
    body: joi.object({
      title: joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
          'string.empty': 'Title is required',
          'string.min': 'Title must be at least 1 character',
          'string.max': 'Title cannot exceed 200 characters'
        }),

      amount: joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
          'number.base': 'Amount must be a number',
          'number.positive': 'Amount must be a positive number',
          'any.required': 'Amount is required'
        }),

      category: joi.string()
        .required()
        .messages({
          'string.empty': 'Category is required'
        }),

      date: joi.date()
        .iso()
        .required()
        .messages({
          'date.base': 'Date must be a valid date',
          'any.required': 'Date is required'
        }),

      description: joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
          'string.max': 'Description cannot exceed 500 characters'
        })
    }),


  },

  updateExpense: {
    body: joi.object({
      title: joi.string()
        .min(1)
        .max(200)
        .optional()
        .messages({
          'string.min': 'Title must be at least 1 character',
          'string.max': 'Title cannot exceed 200 characters'
        }),

      amount: joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
          'number.base': 'Amount must be a number',
          'number.positive': 'Amount must be a positive number'
        }),

      category: joi.string()
        .optional()
        .messages({
          'string.empty': 'Category cannot be empty'
        }),

      date: joi.date()
        .iso()
        .optional()
        .messages({
          'date.base': 'Date must be a valid date'
        }),

      description: joi.string()
        .max(500)
        .optional()
        .allow('')
        .messages({
          'string.max': 'Description cannot exceed 500 characters'
        })
    }),
  }
}



