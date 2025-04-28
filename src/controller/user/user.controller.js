import { userService } from 'root/services/userService.js'
import 'dotenv/config'

// TODO: revisar para no tener que recibir los datos del id por params o query

class UsersController {
  constructor (service) {
    this.service = service
  }

  register = async (req, res, next) => {
    try {
      const body = req.body
      const uploadFile = req.file ? req.file.path : null
      const userData = {
        body,
        uploadFile
      }
      await this.service.register(userData)
      res.redirect('/api/clients/user')
    } catch (error) {
      next(error)
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body
      const { id } = await this.service.login(email, password)
      const token = this.service.generateToken({ id })
      res.cookie('tokenUser', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
      return res.redirect('/api/user/profile')
    } catch (error) {
      next(error)
    }
  }

  loginGoogle = async (req, res, next) => {
    try {
      const { id } = await req.user
      // Genera el token para el user auth con Google
      const token = this.service.generateToken({ id })
      res.cookie('tokenUser', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
      return res.redirect('/api/user/profile')
    } catch (error) {
      next(error)
    }
  }

  logOut = (req, res, next) => {
    try {
      req.cookie('tokenUser', '', {
        httpOnly: true,
        expires: new Date(0)
      })
      res.redirect('/api/clients/user')
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    try {
      const { _id } = await req.user

      const response = await this.service.getById(_id)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  getByEmail = async (req, res, next) => {
    try {
      const body = req.body
      const email = body.email ? body.email : null

      const response = await this.service.getByEmail(email)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const { uid } = req.params
      const body = req.body
      const fileUrl = req.file ? req.file.path : null
      const newAddress = body.newAddress ? JSON.parse(body.newAddress) : null
      const newPaymentMethod = body.newPaymentMethod
        ? JSON.parse(body.newPaymentMethod)
        : null
      const deleteImage = body.deleteImageProfile
        ? body.deleteImageProfile
        : null
      const addressesToDelete = JSON.parse(body.addressesToDelete || '[]')
      const paymentMethodsToDelete = JSON.parse(body.paysToDelete || '[]')

      const data = {
        body,
        fileUrl,
        newAddress,
        newPaymentMethod,
        deleteImage,
        addressesToDelete,
        paymentMethodsToDelete
      }

      const response = await this.service.update(uid, data)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  changeStatus = async (req, res, next) => {
    try {
      const { uid } = req.params
      const response = await this.service.changeStatus(uid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UsersController(userService)
