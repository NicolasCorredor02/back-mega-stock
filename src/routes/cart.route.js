import { Router } from 'express'
import { cartController } from 'root/controller/user/cart.controller.js'

const router = Router()

router.route('/:cid')
  .get(cartController.getById)

router.route('/')
  .get(cartController.getById)
  .post(cartController.create)

export default router
