import { Router } from 'express'
import { userController } from 'root/controller/user/user.controller.js'
import { uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'
import { isAuth, isNotAuth } from 'root/middlewares/authUsers.js'
import { passportCall } from 'root/middlewares/passportCall.js'
import { validatorId } from 'root/middlewares/validators/commonSchemas.js'
import { validatorUserCreate, validatorUserUpdate } from 'root/middlewares/validators/userValidator.js'

const router = Router()

router.route('/')
  .post(validatorUserCreate, uploadUserImages, handleErrorUploads, userController.register.bind(userController))

router.route('/:uid')
  .put(passportCall('jwt-cookies'), isAuth, validatorUserUpdate, uploadUserImages, handleErrorUploads, userController.update.bind(userController))
  .delete(passportCall('jwt-cookies'), isAuth, validatorId, userController.changeStatus.bind(userController))

router.route('/profile')
  .get(passportCall('jwt-cookies'), isAuth, userController.getById.bind(userController))

// * ------------------ Login with token generate --------------------
// User login
router.post(
  '/login',
  userController.login.bind(userController)
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
  userController.loginGoogle.bind(userController)
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
