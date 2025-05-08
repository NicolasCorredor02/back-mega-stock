import { userService } from 'root/services/userService.js'
import 'dotenv/config'

class UsersController {
  constructor () {
    this.userService = userService
  }

  async register (req, res, next) {
    try {
      const body = req.body
      const uploadFile = req.file ? req.file.path : null
      const userData = {
        body,
        uploadFile
      }
      const response = await this.userService.register(userData)

      res.status(201).json({
        message: 'User registered',
        user: response
      })
    } catch (error) {
      next(error)
    }
  }

  // login = async (req, res, next) => {
  //   try {
  //     const body = req.body
  //     const email = body.email ? body.email : null
  //     const password = body.password ? body.password : null

  //     const response = await this.service.login(email, password)
  //     if (!response) res.status(400).json({ message: 'Incorrect credentials' })

  //     // TODO: terminar session para user
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async loginAdmin (req, res, next) {
    try {
      const { email, password } = req.body
      const { id } = await this.userService.loginAdmin(email, password)
      const token = this.userService.generateToken({ id, isAdmin: true })
      res.cookie('tokenAdmin', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      })
      return res.redirect('/api/admin/settings')
    } catch (error) {
      next(error)
    }
  }

  logOut (req, res, next) {
    try {
      req.cookie('tokenAdmin', '', {
        httpOnly: true,
        expires: new Date(0)
      })
      res.redirect('/api/admin')
    } catch (error) {
      next(error)
    }
  }

  async getAll (req, res, next) {
    try {
      // Extraemos query params para filtrado y paginación
      const {
        limit = 10,
        page = 1,
        sort
      } = req.query

      // Creamos el objeto de filtros
      const filter = {}

      // Opciones de paginación y ordenamiento
      const options = {
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }

      if (sort) {
        const [field, order] = sort.split(':')
        options.orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' }
      }

      const context = {
        products: await this.userService.getAll(filter, options)
      }

      res.status(200).json(context)
    } catch (error) {
      next(error)
    }
  }

  async getById (req, res, next) {
    try {
      const { uid } = req.params

      const response = await this.userService.getById(uid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
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

      const response = await this.userService.update(uid, data)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async changeStatus (req, res, next) {
    try {
      const { uid } = req.params
      const response = await this.userService.changeStatus(uid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      const { uid } = req.params
      const response = await this.userService.delete(uid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UsersController()
