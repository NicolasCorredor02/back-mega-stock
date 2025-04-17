import { Router } from 'express'
import { productController } from 'root/controller/user/product.controller.js'

const router = Router()

router.route('/')
  .get(productController.getAll)

router.route('/:pid')
  .get(productController.getById)

export default router
