import { Router } from 'express'
import { CartsController } from 'root/controller/client/cart.controller.js'

const router = Router()
// Get cart by id
router.get('/:cid', CartsController.getCartById)

router.get('/', CartsController.getCartById)
export default router
