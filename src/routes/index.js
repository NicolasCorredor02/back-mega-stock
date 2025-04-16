import { Router } from 'express'
import products from 'root/routes/product.route.js'
import carts from 'root/routes/cart.route.js'
import admin from 'root/routes/admin.routes.js'
import user from 'root/routes/user.route.js'
import { productController } from 'root/controller/user/product.controller.js'

const router = Router()

/**
 * Get de Home Page
 */
router.get('/', productController.getAll)

router.use('/api/clients/products', products)
router.use('/api/clients/cart', carts)
router.use('/api/clients/user', user)
router.use('/api/admin', admin)

export default router
