import { Router } from 'express'
import { userController } from 'root/controller/user/user.controller.js'
import { uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'
import { isAuth, isNotAuth } from 'root/middlewares/authUsers.js'
import { passportCall } from 'root/middlewares/passportCall.js'

const router = Router()

// Post to create a user
router.post(
  '/register',
  uploadUserImages,
  handleErrorUploads,
  userController.register
)

// Put to update a user
router.put('/update/:uid',
  passportCall('jwt-cookies'),
  isAuth,
  uploadUserImages,
  handleErrorUploads,
  userController.update
)

// Delete to soft delete of user
router.delete('/delete', passportCall('jwt-cookies'), isAuth, userController.changeStatus)

// Get by Id
router.get('/profile', passportCall('jwt-cookies'), isAuth, userController.getById)

// User login
router.post(
  '/login',
  userController.login
)

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

// Log out
router.get('/logout', passportCall('jwt-cookies'), isAuth, userController.logOut)

// Get para render de form para register
router.get('/register', passportCall('jwt-cookies'), isNotAuth, (req, res, next) => {
  try {
    return res.render('userRegister')
  } catch (error) {
    next(error)
  }
})

// Get by email
router.get('/', passportCall('jwt-cookies'), isNotAuth, (req, res, next) => {
  try {
    return res.render('userLogin')
  } catch (error) {
    next(error)
  }
})

export default router
