import { Router } from 'express'
import { cartController } from 'root/controller/user/cart.controller.js'
import { validatorId } from 'root/middlewares/validators/commonSchemas.js'
const router = Router()

router.route('/:cid')
  .get(validatorId, cartController.getById.bind(cartController))

router.route('/')
  .get(validatorId, cartController.getById.bind(cartController))
  .post(cartController.create.bind(cartController))

export default router
