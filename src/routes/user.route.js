import { Router } from 'express'
import { userController } from 'root/controller/user/user.controller.js'
import { uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'
import { isAuth, isNotAuth } from 'root/middlewares/authUsers.js'
import { passportCall } from 'root/middlewares/passportCall.js'

const router = Router()

router.route('/')
  .post(uploadUserImages, handleErrorUploads, userController.register)

router.route('/:uid')
  .put(passportCall('jwt-cookies'), isAuth, uploadUserImages, handleErrorUploads, userController.update)
  .delete(passportCall('jwt-cookies'), isAuth, userController.changeStatus)

router.route('/profile')
  .get(passportCall('jwt-cookies'), isAuth, userController.getById)

// * ------------------ Login with token generate --------------------
// User login
router.post(
  '/login',
  userController.login
)

// * ------------------ Login or register with Google and Callback function ---------
router.get(
  '/login/auth/google',
  passportCall('google', { scope: ['profile', 'email'] }) // Implementacion del middleware de strategy para iniciar el flujo de session con Google
)

// Callback para Google Auth
router.get(
  '/login/auth/google/callback',
  passportCall('google', { failureRedirect: '/' }), // Implementacion del middleware de strategy para validar la session con Google
  userController.loginGoogle
)

// * ----------------- Render user register form ---------------------
router.get('/register', passportCall('jwt-cookies'), isNotAuth, (req, res, next) => {
  try {
    return res.render('userRegister')
  } catch (error) {
    next(error)
  }
})

// * ------------------- Render user login form -------------------------
router.get('/', passportCall('jwt-cookies'), isNotAuth, (req, res, next) => {
  try {
    return res.render('userLogin')
  } catch (error) {
    next(error)
  }
})

export default router
