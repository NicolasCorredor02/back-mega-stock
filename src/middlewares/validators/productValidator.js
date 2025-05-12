import Joi from 'joi'

const createProductSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'El título es obligatorio',
    'string.empty': 'El título no puede estar vacío'
  }),
  price: Joi.number().min(0.01).required().messages({
    'any.required': 'El precio es obligatorio',
    'number.min': 'El precio no puede ser negativo',
    'number.base': 'El precio debe ser un número válido'
  }),
  description: Joi.string().required().messages({
    'any.required': 'La descripción es obligatoria',
    'string.empty': 'La descripción no puede estar vacía'
  }),
  code: Joi.string()
    .pattern(/^[A-Z]{3}-[A-Z]{2}\d{2}$/)
    .required()
    .messages({
      'any.required': 'El código es obligatorio',
      'string.pattern.base': 'El código debe usar el formato: TEC-SS01 (3 letras mayúsculas, guión, 2 letras mayúsculas y 2 números)'
    }),
  thumbnails: Joi.array()
    .items(Joi.string().uri().messages({
      'string.uri': 'Debe ser una URL válida'
    }))
    .optional(),
  stock: Joi.number().integer().min(1).required().messages({
    'any.required': 'El stock es obligatorio',
    'number.min': 'El stock no puede ser negativo',
    'number.base': 'El stock debe ser un número entero válido'
  }),
  status: Joi.boolean().optional(),
  category: Joi.string().required().messages({
    'any.required': 'La categoría es obligatoria',
    'string.empty': 'La categoría no puede estar vacía'
  })
})

// Schema para actualizar
const updateProductSchema = Joi.object({
  title: Joi.string().optional(),
  price: Joi.number().min(0.01).optional(),
  description: Joi.string().optional(),
  code: Joi.string()
    .pattern(/^[A-Z]{3}-[A-Z]{2}\d{2}$/)
    .optional(),
  thumbnails: Joi.array()
    .items(Joi.string().uri().messages({
      'string.uri': 'Debe ser una URL válida'
    }))
    .optional(),
  stock: Joi.number().integer().min(1).optional(),
  status: Joi.boolean().optional(),
  category: Joi.string().optional()
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar'
})

export const validatorProductCreate = (req, res, next) => {
  const { error } = createProductSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}

export const validatorProductUpdate = (req, res, next) => {
  const { error } = updateProductSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
