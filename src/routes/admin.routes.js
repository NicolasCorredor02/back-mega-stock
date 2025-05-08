import { Router } from 'express'
import { productController } from 'root/controller/admin/product.controller.js'
import { cartController } from 'root/controller/admin/cart.controller.js'
import { userController } from 'root/controller/admin/user.controller.js'
import { uploadProductImages, uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'
import { isAuthAdmin, isNotAuthAdmin } from 'root/middlewares/authAdmin.js'
import { passportCall } from 'root/middlewares/passportCall.js'

const router = Router()

//* --------------- Admin products ------------------------
router.route('/products')
  .post(passportCall('jwt-cookies'), isAuthAdmin, uploadProductImages, handleErrorUploads, productController.create.bind(productController))
  .get(passportCall('jwt-cookies'), isAuthAdmin, productController.getAll.bind(productController))

router.route('/products/:pid')
  .put(passportCall('jwt-cookies'), isAuthAdmin, uploadProductImages, handleErrorUploads, productController.update.bind(productController))
  .delete(passportCall('jwt-cookies'), isAuthAdmin, productController.delete.bind(productController))
  .get(passportCall('jwt-cookies'), isAuthAdmin, productController.getById.bind(productController))

//* --------------- Admin carts ------------------------
router.route('/carts')
  .post(passportCall('jwt-cookies'), isAuthAdmin, cartController.create.bind(cartController))
  .get(passportCall('jwt-cookies'), isAuthAdmin, cartController.getAll.bind(cartController))

router.route('/carts/:cid')
  .put(passportCall('jwt-cookies'), isAuthAdmin, cartController.update.bind(cartController))
  .delete(passportCall('jwt-cookies'), isAuthAdmin, cartController.delete.bind(cartController))
  .get(passportCall('jwt-cookies'), isAuthAdmin, cartController.getById.bind(cartController))

//* --------------- Admin users ------------------------
router.route('/users')
  .post(passportCall('jwt-cookies'), isAuthAdmin, uploadUserImages, handleErrorUploads, userController.register.bind(userController))
  .get(passportCall('jwt-cookies'), isAuthAdmin, userController.getAll.bind(userController))

router.route('/users/:uid')
  .put(passportCall('jwt-cookies'), isAuthAdmin, uploadUserImages, handleErrorUploads, userController.update.bind(userController))
  .delete(passportCall('jwt-cookies'), isAuthAdmin, userController.delete.bind(userController))
  .get(passportCall('jwt-cookies'), isAuthAdmin, userController.getById.bind(userController))

// * -------------------- Render settings -------------------
// Get admin settings
router.get('/settings', passportCall('jwt-cookies'), isAuthAdmin, (req, res, next) => {
  try {
    return res.render('adminSettings')
  } catch (error) {
    next(error)
  }
})

// * ------------------- Admin login and logout----------------------
// Post para iniciar sesion como admin
router.post(
  '/login',
  userController.loginAdmin.bind(userController)
)

// Get para cerrar session
router.get('/logout', passportCall('jwt-cookies'), isAuthAdmin, userController.logOut)

// * --------------------- Render login form --------------------
// Validator for admin
router.get('/', passportCall('jwt-cookies'), isNotAuthAdmin, (req, res, next) => {
  try {
    return res.render('adminLogin')
  } catch (error) {
    next(error)
  }
})
export default router
