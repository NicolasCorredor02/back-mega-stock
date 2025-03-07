import { Router } from 'express'
import { ProductsController } from 'root/controller/product.controller.js'

const router = Router()

// Get limit products by category
router.get('/:category/limited/:limit', ProductsController.getLimitProducts)

// Get limit products
router.get('/limited/:limit', ProductsController.getLimitProducts)

// Get product by ID
router.get('/product/:pid', ProductsController.getProductById)

// Get all products by category
router.get('/:category', ProductsController.getProducts)

// Get categories
// router.get("/categories", ProductsController.getCategories);

// Get all products
router.get('/', ProductsController.getProducts)

export default router
