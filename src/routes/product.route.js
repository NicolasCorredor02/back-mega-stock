import { Router } from 'express'
import { productController } from 'root/controller/user/product.controller.js'
// import ProductsController from 'root/controller/user/product.controller.js'

const router = Router()
// const productController = new ProductsController()

router.route('/')
  .get(productController.getAll.bind(productController))

router.route('/:pid')
  .get(productController.getById.bind(productController))

export default router
