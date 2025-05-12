import Joi from 'joi'

// create schema
const createUserSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2 })
    .required()
    .messages({
      'string.email': 'Formato de email inválido',
      'any.required': 'El email es obligatorio'
    }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .optional()
    .messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial'
    }),

  first_name: Joi.string()
    .required()
    .messages({
      'any.required': 'El nombre es obligatorio',
      'string.empty': 'El nombre no puede estar vacío'
    }),

  last_name: Joi.string().optional(),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Formato telefónico inválido (usar E.164)'
    }),

  id_number: Joi.string()
    .pattern(/^[A-Za-z0-9-]{6,20}$/)
    .required()
    .messages({
      'any.required': 'El número de identificación es obligatorio',
      'string.pattern.base': 'Formato de identificación inválido'
    }),

  image_profile: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'La URL de la imagen debe ser válida'
    }),

  status: Joi.boolean().optional(),
  custom_tier: Joi.string().valid('regular', 'premium', 'vip').default('regular'),
  plarform: Joi.string().valid('google').default(' ')
})

// update schema
const updateUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Formato de email inválido'
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .optional(),

  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),

  id_number: Joi.string()
    .pattern(/^[A-Za-z0-9-]{6,20}$/)
    .optional(),

  image_profile: Joi.string().uri().optional(),
  status: Joi.boolean().optional(),
  custom_tier: Joi.string().valid('regular', 'premium', 'vip').optional()
})

export const validatorUserCreate = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}

export const validatorUserUpdate = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
