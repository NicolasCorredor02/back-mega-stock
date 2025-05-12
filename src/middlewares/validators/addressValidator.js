import Joi from 'joi'
import { idSchema } from 'root/middlewares/validators/commonSchemas.js'

// Schema para create
const createAddressSchema = Joi.object({
  street: Joi.string().required().messages({
    'any.required': 'La calle es obligatoria',
    'string.empty': 'La calle no puede estar vacía'
  }),
  city: Joi.string().required().messages({
    'any.required': 'La ciudad es obligatoria',
    'string.empty': 'La ciudad no puede estar vacía'
  }),
  state: Joi.string().required().messages({
    'any.required': 'El estado/provincia es obligatorio',
    'string.empty': 'El estado/provincia no puede estar vacío'
  }),
  country: Joi.string().required().messages({
    'any.required': 'El país es obligatorio',
    'string.empty': 'El país no puede estar vacío'
  }),
  postal_code: Joi.string()
    .pattern(/^[A-Za-z0-9\- ]{3,10}$/)
    .required()
    .messages({
      'any.required': 'El código postal es obligatorio',
      'string.pattern.base': 'Formato de código postal inválido'
    }),
  is_saved: Joi.boolean().optional().default(false),
  userId: idSchema.optional().messages({
    'string.guid': 'El ID de usuario debe ser un UUID válido'
  })
})

// Schema para update
const updateAddressSchema = Joi.object({
  street: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string()
    .pattern(/^[A-Za-z0-9\- ]{3,10}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Formato de código postal inválido'
    }),
  is_saved: Joi.boolean().optional(),
  userId: idSchema.optional().messages({
    'string.guid': 'El ID de usuario debe ser un UUID válido'
  })
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar'
})

export const validatorAddressCreate = (req, res, next) => {
  const { error } = createAddressSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}

export const validatorAddressUpdate = (req, res, next) => {
  const { error } = updateAddressSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
