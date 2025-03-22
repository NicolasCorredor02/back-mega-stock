import { Router } from 'express'
import { CartsController } from 'root/controller/cart.controller.js'

const router = Router()

// Post create a cart
router.post('/create', CartsController.createCart)

// Get cart by id
router.get('/cart/:cid', CartsController.getCartById)

// Put para actualizar la data de un carrito
router.put('/update/cart/:cid', CartsController.updateCartData)

// Delete cart by id
router.delete('/delete/cart/:cid', CartsController.deleteCart)

// Get all Carts
router.get('/', CartsController.getAllCarts)

export default router
