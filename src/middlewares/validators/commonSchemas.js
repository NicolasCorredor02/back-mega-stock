import Joi from 'joi'

// Esquema común para validar UUID
export const idSchema = Joi.string().guid({
  version: ['uuidv4']
}).messages({
  'string.guid': 'El ID debe ser un UUID válido'
})

export const validatorId = (req, res, next) => {
  const { error } = idSchema.validate(req.body, { abortEarly: false })
  error ? res.status(400).send(error) : next()
}
