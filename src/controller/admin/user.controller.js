import { userService } from 'root/services/userService.js'

class UsersController {
  constructor (service) {
    this.service = service
  }

  register = async (req, res, next) => {
    try {
      res.json({
        message: 'User registered',
        session: req.session
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

  loginAdmin = async (req, res, next) => {
    try {
      return res.redirect('/api/admin/settings')
      // req.session.info = {
      //   loggedAdminIn: true,
      //   email,
      //   password
      // }
      // res.json({ message: 'Welcome admin!' })
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req, res, next) => {
    try {
      const reqQuerys = req.query

      const context = {
        users: await this.service.getAll(reqQuerys)
      }

      res.status(200).json(context)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    try {
      const { uid } = req.params

      const response = await this.service.getById(uid)

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
      const { uid } = req.query
      const response = await this.service.changeStatus(uid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      const { uid } = req.query
      const response = await this.service.delete(uid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UsersController(userService)
