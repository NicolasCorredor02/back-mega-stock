import { Router } from 'express'
import { ProductsController } from 'root/controller/admin/product.controller.js'
import { CartsController } from 'root/controller/admin/cart.controller.js'
import { uploadProductImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'

const router = Router()

//* --------------- Admin products ------------------------
// Post product into DB
router.post(
  '/products/product/add',
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.addProduct
)

// Put product to update
router.put(
  '/products/product/update/:pid',
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  ProductsController.updateProduct
)

// Change product's status from DB
// router.delete('/products/product/delete', ProductsController.changeStatus)

// Delete product from DB
router.delete('/products/product/delete', ProductsController.deleteProduct)

// Get product by ID
router.get('/products/product/:pid', ProductsController.getProductById)

// Get all products
router.get('/products', ProductsController.getProducts)

//* --------------- Admin carts ------------------------
// Post create a cart
router.post('/carts/cart/create', CartsController.createCart)

// Put para actualizar la data de un carrito
router.put('/carts/cart/update/:cid', CartsController.updateCartData)

// Delete cart by id
router.delete('/carts/cart/delete', CartsController.deleteCart)

// Get cart by ID
router.get('/carts/cart/:cid', CartsController.getCartById)

// Get all Carts
router.get('/carts', CartsController.getAllCarts)

// Get all CartsJSON
router.get('/carts/JSON', CartsController.getAllCartsJSON)

// Get admin settings
router.get('/', (req, res, next) => {
  try {
    return res.render('adminSettings')
  } catch (error) {
    next(error)
  }
})
export default router
