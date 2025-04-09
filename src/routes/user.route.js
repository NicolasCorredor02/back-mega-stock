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
  passportCall('register'), // Implementacion del middleware de strategy para validar la session
  userController.register
)

// Put to update a user
router.put('/update/:uid',
  isAuth,
  uploadUserImages,
  handleErrorUploads,
  userController.update
)

// Delete to soft delete of user
router.delete('/delete', isAuth, userController.changeStatus)

// Get by Id
router.get('/profile/:uid', isAuth, userController.getById)

// User login
router.post(
  '/login',
  passportCall('login'), // Implementacion del middleware de strategy para validar la session
  userController.login
)

router.get(
  '/login/auth/google',
  passportCall('google', { scope: ['profile', 'email'] }), // Implementacion del middleware de strategy para validar la session con Google
  userController.login
)

// Log out session
router.get('/logout', isAuth, userController.logOut)

// Get para render de form para register
router.get('/register', isNotAuth, (req, res, next) => {
  try {
    return res.render('userRegister')
  } catch (error) {
    next(error)
  }
})

// Get by email
router.get('/', isNotAuth, (req, res, next) => {
  try {
    return res.render('userLogin')
  } catch (error) {
    next(error)
  }
})

export default router
