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
  .post(passportCall('jwt-cookies'), isAuthAdmin, uploadProductImages, handleErrorUploads, productController.create)
  .get(passportCall('jwt-cookies'), isAuthAdmin, productController.getAll)

router.route('/products/:pid')
  .put(passportCall('jwt-cookies'), isAuthAdmin, uploadProductImages, handleErrorUploads, productController.update)
  .delete(passportCall('jwt-cookies'), isAuthAdmin, productController.delete)
  .get(passportCall('jwt-cookies'), isAuthAdmin, productController.getById)

//* --------------- Admin carts ------------------------
router.route('/carts')
  .post(passportCall('jwt-cookies'), isAuthAdmin, cartController.create)
  .get(passportCall('jwt-cookies'), isAuthAdmin, cartController.getAll)

router.route('/carts/:cid')
  .put(passportCall('jwt-cookies'), isAuthAdmin, cartController.update)
  .delete(passportCall('jwt-cookies'), isAuthAdmin, cartController.delete)
  .get(passportCall('jwt-cookies'), isAuthAdmin, cartController.getById)

//* --------------- Admin users ------------------------
router.route('/users')
  .post(passportCall('jwt-cookies'), isAuthAdmin, uploadUserImages, handleErrorUploads, userController.register)
  .get(passportCall('jwt-cookies'), isAuthAdmin, userController.getAll)

router.route('/users/:uid')
  .put(passportCall('jwt-cookies'), isAuthAdmin, uploadUserImages, handleErrorUploads, userController.update)
  .delete(passportCall('jwt-cookies'), isAuthAdmin, userController.delete)
  .get(passportCall('jwt-cookies'), isAuthAdmin, userController.getById)

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
  userController.loginAdmin
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
