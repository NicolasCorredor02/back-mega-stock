import { Router } from 'express'
import { productController } from 'root/controller/admin/product.controller.js'
import { cartController } from 'root/controller/admin/cart.controller.js'
import { userController } from 'root/controller/admin/user.controller.js'
import { uploadProductImages, uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'
import { isAuthAdminLogin, isNotAuthAdminLogin } from 'root/middlewares/authAdminLogin.js'

const router = Router()

//* --------------- Admin products ------------------------
// Post product into DB
router.post(
  '/products/product/add',
  isAuthAdminLogin, // Middleware para validar si el usuario en session actual corresponde al admin
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  productController.create
)

// Put product to update
router.put(
  '/products/product/update/:pid',
  isAuthAdminLogin,
  uploadProductImages, // Se añade el middleware de upload de la configuraion de multer para trabajar con las imagenes de los productos (max 5)
  handleErrorUploads, // Se agrega el middleware para validar los files que se suben como imagen del producto
  productController.update
)

// Change product's status from DB
// router.delete('/products/product/delete', productController.changeStatus)

// Delete product from DB
router.delete('/products/product/delete', isAuthAdminLogin, productController.delete)

// Get product by ID
router.get('/products/product/:pid', isAuthAdminLogin, productController.getById)

// Get all products
router.get('/products', isAuthAdminLogin, productController.getAll)

//* --------------- Admin carts ------------------------
// Post create a cart
router.post('/carts/cart/create', isAuthAdminLogin, cartController.create)

// Put para actualizar la data de un carrito
router.put('/carts/cart/update/:cid', isAuthAdminLogin, cartController.update)

// Delete cart by id
router.delete('/carts/cart/delete', isAuthAdminLogin, cartController.delete)

// Get cart by ID
router.get('/carts/cart/:cid', isAuthAdminLogin, cartController.getById)

// Get all Carts
router.get('/carts', isAuthAdminLogin, cartController.getAll)

//* --------------- Admin users ------------------------
// POST create user
router.post('/users/user/create',
  isAuthAdminLogin,
  uploadUserImages,
  handleErrorUploads,
  userController.create)

// PUT update user
router.put('/users/user/update/:uid',
  isAuthAdminLogin,
  uploadUserImages,
  handleErrorUploads,
  userController.update
)

// Change user's status
// router.delete('/users/user/delete', isAuthAdminLogin, userController.changeStatus)

// Delete user
router.delete('/users/user/delete', isAuthAdminLogin, userController.delete)

// Get User by ID
router.get('/users/user/:uid', isAuthAdminLogin, userController.getById)

// Get all users
router.get('/users', isAuthAdminLogin, userController.getAll)

// Get admin settings
router.get('/settings', isAuthAdminLogin, (req, res, next) => {
  try {
    return res.render('adminSettings')
  } catch (error) {
    next(error)
  }
})

// Post para iniciar sesion como admin
router.post('/login', userController.loginAdmin)

// Validator for admin
router.get('/', isNotAuthAdminLogin, (req, res, next) => {
  try {
    return res.render('adminLogin')
  } catch (error) {
    next(error)
  }
})
export default router
