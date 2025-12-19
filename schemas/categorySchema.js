import joi from "joi";

export default {
  categorySchema: {
    body: joi.object({
      name: joi.string().min(1).max(50).required(),
      color: joi.string()
        .optional()
        .allow(null, '')
        .messages({
          'string.base': 'Color must be a string'
        })
    })

    // params: joi.object({})
  },


}

