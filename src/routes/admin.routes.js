import { Router } from 'express'
import { productController } from 'root/controller/admin/product.controller.js'
import { cartController } from 'root/controller/admin/cart.controller.js'
import { userController } from 'root/controller/admin/user.controller.js'
import { uploadProductImages, uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'

const router = Router()

//* --------------- Admin products ------------------------
// Post product into DB
router.post(
  '/products/product/add',
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  productController.create
)

// Put product to update
router.put(
  '/products/product/update/:pid',
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  productController.update
)

// Change product's status from DB
// router.delete('/products/product/delete', productController.changeStatus)

// Delete product from DB
router.delete('/products/product/delete', productController.delete)

// Get product by ID
router.get('/products/product/:pid', productController.getById)

// Get all products
router.get('/products', productController.getAll)

//* --------------- Admin carts ------------------------
// Post create a cart
router.post('/carts/cart/create', cartController.create)

// Put para actualizar la data de un carrito
router.put('/carts/cart/update/:cid', cartController.update)

// Delete cart by id
router.delete('/carts/cart/delete', cartController.delete)

// Get cart by ID
router.get('/carts/cart/:cid', cartController.getById)

// Get all Carts
router.get('/carts', cartController.getAll)

//* --------------- Admin users ------------------------
// POST create user
router.post('/users/user/create',
  uploadUserImages,
  handleErrorUploads,
  userController.create)

// PUT update user
router.put('/users/user/update/:uid',
  uploadUserImages,
  handleErrorUploads,
  userController.update
)

// Change user's status
// router.delete('/users/user/delete', userController.changeStatus)

// Delete user
router.delete('/users/user/delete', userController.delete)

// Get User by ID
router.get('/users/user/:uid', userController.getById)

// Get all users
router.get('/users', userController.getAll)

// Get admin settings
router.get('/', (req, res, next) => {
  try {
    return res.render('adminSettings')
  } catch (error) {
    next(error)
  }
})
export default router
