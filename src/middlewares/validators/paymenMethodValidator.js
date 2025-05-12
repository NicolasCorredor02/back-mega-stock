import Joi from 'joi'
import { idSchema } from 'root/middlewares/validators/commonSchemas.js'

const createPaymentSchema = Joi.object({
  type: Joi.string().valid('card', 'paypal', 'transfer').required().messages({
    'any.required': 'El tipo de método de pago es obligatorio',
    'any.only': 'El tipo debe ser: card, paypal o transfer'
  }),
  provider: Joi.when('type', {
    is: 'card',
    then: Joi.string().optional().messages({
      'string.base': 'El proveedor debe ser un texto válido'
    })
  }),
  card_number: Joi.when('type', {
    is: 'card',
    then: Joi.string()
      .pattern(/^\d{13,19}$/)
      .optional()
      .messages({
        'string.pattern.base':
          'El número de tarjeta debe contener entre 13 y 19 dígitos',
        'string.base': 'El número de tarjeta debe ser un texto'
      }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'El número de tarjeta solo se permite para tarjetas'
    })
  }),
  last_four: Joi.when('type', {
    is: 'card',
    then: Joi.string().length(4).pattern(/^\d+$/).optional().messages({
      'string.length':
        'Los últimos 4 dígitos deben tener exactamente 4 caracteres',
      'string.pattern.base': 'Los últimos 4 dígitos deben ser números'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'Los últimos 4 dígitos solo se permiten para tarjetas'
    })
  }),
  expiry_date: Joi.when('type', {
    is: 'card',
    then: Joi.string()
      .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
      .optional()
      .messages({
        'string.pattern.base':
          'La fecha de expiración debe tener el formato MM/AA o MM/AAAA'
      }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': 'La fecha de expiración solo se permite para tarjetas'
    })
  }),
  reference: Joi.when('type', {
    is: Joi.valid('paypal', 'transfer'),
    then: Joi.string().optional().messages({
      'string.base': 'La referencia debe ser un texto válido'
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown':
        'La referencia solo se permite para PayPal o Transferencias'
    })
  }),
  is_saved: Joi.boolean().optional().messages({
    'boolean.base': 'El campo is_saved debe ser un valor booleano'
  }),
  userId: idSchema.optional().messages({
    'string.guid': 'El ID de usuario debe ser un UUID válido'
  })
})

// Schema para actualizar
const updatePaymentSchema = Joi.object({
  type: Joi.string()
    .valid('card', 'paypal', 'transfer')
    .optional()
    .messages({
      'any.only': 'El tipo debe ser: card, paypal o transfer'
    }),

  provider: Joi.when('type', {
    is: 'card',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }).optional(),

  card_number: Joi.when('type', {
    is: 'card',
    then: Joi.string()
      .pattern(/^\d{13,19}$/)
      .optional(),
    otherwise: Joi.forbidden()
  }).optional(),

  last_four: Joi.when('type', {
    is: 'card',
    then: Joi.string()
      .length(4)
      .pattern(/^\d+$/)
      .optional(),
    otherwise: Joi.forbidden()
  }).optional(),

  expiry_date: Joi.when('type', {
    is: 'card',
    then: Joi.string()
      .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
      .optional(),
    otherwise: Joi.forbidden()
  }).optional(),

  reference: Joi.when('type', {
    is: Joi.valid('paypal', 'transfer'),
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }).optional(),

  is_saved: Joi.boolean().optional()
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar'
})

export const validatorPaymentCreate = (req, res, next) => {
  const { error } = createPaymentSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}

export const validatorPaymentUpdate = (req, res, next) => {
  const { error } = updatePaymentSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
