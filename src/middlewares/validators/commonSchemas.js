import Joi from 'joi'

const uuidQuerySchema = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4']
    })
    .required()
    .messages({
      'string.guid': 'El ID debe ser un UUID v4 válido',
      'any.required': 'El ID es requerido en los query parameters'
    })
})

// Esquema común para validar UUID usado por mas schemas
export const idSchema = Joi.string().guid({
  version: ['uuidv4']
}).messages({
  'string.guid': 'El ID debe ser un UUID válido'
})

export const validatorId = (req, res, next) => {
  const { error } = uuidQuerySchema.validate(req.query, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
