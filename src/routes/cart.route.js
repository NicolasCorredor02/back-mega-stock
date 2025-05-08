import { Router } from 'express'
import { cartController } from 'root/controller/user/cart.controller.js'

const router = Router()

router.route('/:cid')
  .get(cartController.getById.bind(cartController))

router.route('/')
  .get(cartController.getById.bind(cartController))
  .post(cartController.create.bind(cartController))

export default router
