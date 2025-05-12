import { Router } from 'express'
import { productController } from 'root/controller/user/product.controller.js'
import { validatorId } from 'root/middlewares/validators/commonSchemas.js'

const router = Router()

router.route('/')
  .get(productController.getAll.bind(productController))

router.route('/:pid')
  .get(validatorId, productController.getById.bind(productController))

export default router
