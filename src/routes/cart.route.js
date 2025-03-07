import { Router } from 'express'
import { CartsController } from 'root/controller/cart.controller.js'

const router = Router()

// Post create a cart
router.post('/', CartsController.createCart)

// Get cart by id
router.get('/cart/:cid', CartsController.getCart)

// Post add product to cart by id
router.post('/add/:cid/product', CartsController.addProductCart)

export default router
