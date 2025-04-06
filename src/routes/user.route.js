import { Router } from 'express'
import passport from 'passport'
import { userController } from 'root/controller/user/user.controller.js'
import { uploadUserImages } from 'root/config/multer.js'
import handleErrorUploads from 'root/middlewares/handleErrorUploads.js'

const router = Router()

// Post to create a user
router.post(
  '/register',
  uploadUserImages,
  handleErrorUploads,
  passport.authenticate('register'),
  userController.register
)

// Put to update a user
router.put('/update/:uid',
  uploadUserImages,
  handleErrorUploads,
  userController.update
)

// Delete to soft delete of user
router.delete('/delete', userController.changeStatus)

// Get by Id
router.get('/:uid', userController.getById)

// User login
router.post('/login', passport.authenticate('login'), userController.login)

// Get by email
router.get('/', userController.getByEmail)

export default router
