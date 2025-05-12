import Joi from 'joi'
import { idSchema } from 'root/middlewares/validators/commonSchemas.js'

const createCartSchema = Joi.object({
  user_type: Joi.string()
    .valid('guest', 'registered')
    .required()
    .messages({
      'any.required': 'El tipo de usuario es obligatorio',
      'any.only': 'El tipo de usuario debe ser guest o registered'
    }),

  // Campos para guest
  guest_first_name: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().required().messages({
      'any.required': 'El nombre es obligatorio para usuarios guest'
    }),
    otherwise: Joi.forbidden()
  }),

  guest_last_name: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().required().messages({
      'any.required': 'El apellido es obligatorio para usuarios guest'
    }),
    otherwise: Joi.forbidden()
  }),

  guest_email: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().email().required().messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es obligatorio para usuarios guest'
    }),
    otherwise: Joi.forbidden()
  }),

  guest_phone: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required().messages({
      'string.pattern.base': 'Número telefónico inválido (formato E.164)'
    }),
    otherwise: Joi.forbidden()
  }),

  guest_id_number: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().pattern(/^[A-Za-z0-9-]+$/).required().messages({
      'string.pattern.base': 'Formato de identificación inválido'
    }),
    otherwise: Joi.forbidden()
  }),

  // Campos para registered
  userId: Joi.when('user_type', {
    is: 'registered',
    then: idSchema.required().guid({
      version: ['uuidv4']
    }).messages({
      'any.required': 'El ID de usuario es obligatorio para usuarios registrados',
      'string.guid': 'El ID debe ser un UUID válido'
    }),
    otherwise: Joi.forbidden()
  }),

  // Campos comunes
  addressId: idSchema.required().messages({
    'string.guid': 'El ID de dirección debe ser un UUID válido'
  }),

  paymentMethodId: idSchema.required().messages({
    'string.guid': 'El ID de método de pago debe ser un UUID válido'
  }),

  status: Joi.string()
    .valid('active', 'completed', 'canceled', 'pending')
    .default('active')
    .messages({
      'any.only': 'Estado inválido: active, completed, canceled o pending'
    }),

  sub_total: Joi.number()
    .required()
    .precision(2)
    .min(0)
    .default(0)
    .messages({
      'number.min': 'El subtotal no puede ser negativo',
      'number.base': 'El subtotal debe ser un número válido'
    })
})

// Schema para actualizar
const updateCartSchema = Joi.object({
  // Campos condicionales
  guest_first_name: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),

  guest_last_name: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),

  guest_email: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().email().optional(),
    otherwise: Joi.forbidden()
  }),

  guest_phone: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    otherwise: Joi.forbidden()
  }),

  guest_id_number: Joi.when('user_type', {
    is: 'guest',
    then: Joi.string().pattern(/^[A-Za-z0-9-]+$/).optional(),
    otherwise: Joi.forbidden()
  }),

  userId: Joi.when('user_type', {
    is: 'registered',
    then: idSchema.optional(),
    otherwise: Joi.forbidden()
  }),

  status: Joi.string()
    .valid('active', 'completed', 'canceled', 'pending')
    .optional(),

  sub_total: Joi.number()
    .precision(2)
    .min(0)
    .optional()
}).min(1).messages({
  'object.min': 'Debe enviar al menos un campo para actualizar'
})

export const validatorCartCreate = (req, res, next) => {
  const { error } = createCartSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}

export const validatorCartUpdate = (req, res, next) => {
  const { error } = updateCartSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
