import { Router } from 'express'
import { cartController } from 'root/controller/user/cart.controller.js'

const router = Router()
// Get cart by id
router.get('/:cid', cartController.getById)

router.get('/', cartController.getById)

export default router
