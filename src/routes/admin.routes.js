import { Router } from 'express'
import { ProductsController } from 'root/controller/product.controller.js'
import { uploadProductImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'

const router = Router()

//* --------------- Admin products since admin ------------------------
// Post product into DB
router.post(
  '/products/add',
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.addProduct
)

// Put product to update
router.put(
  '/products/update/:pid',
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.updateProduct
)

// Change product's status from DB
router.delete('/product/delete', ProductsController.changeStatus)

// Delete product from DB
// router.delete('/product/delete', ProductsController.deleteProduct)

// Get product by ID
router.get('/product/:pid', ProductsController.getProductById)

// Get all products
router.get('/', ProductsController.getProductsAdmin)

export default router
