import { Router } from 'express'
import products from 'root/routes/product.route.js'
import carts from 'root/routes/cart.route.js'
import admin from 'root/routes/admin.routes.js'
import { ProductsController } from 'root/controller/client/product.controller.js'

const router = Router()

/**
 * Get de Home Page
 */
router.get('/', ProductsController.getProducts)

router.use('/api/clients/products', products)
router.use('/api/clients/cart', carts)
router.use('/api/admin', admin)

export default router
