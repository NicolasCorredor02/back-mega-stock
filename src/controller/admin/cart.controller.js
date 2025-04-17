import { cartService } from 'root/services/cartService.js'
import { productService } from 'root/services/productService.js'

export class CartsController {
  constructor (service, productService) {
    this.service = service
    this.productService = productService
  }

  create = async (req, res, next) => {
    try {
      const body = req.body

      const formatedData = {
        ...body,
        paymentMethod: body.payment_method
      }

      const response = await this.service.create(formatedData)

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req, res, next) => {
    try {
      const reqQuerys = req.query

      const context = {
        products: await this.productService.getAll(reqQuerys),
        carts: await this.service.getAll(reqQuerys)
      }

      // res.status(200).json(context)

      return res.render('cartsAdmin', context)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    try {
      const { cid } = req.params

      const response = await this.service.getById(cid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  update = async (req, res, next) => {
    try {
      const { cid } = req.params
      const body = req.body

      const response = await this.service.update(cid, body)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      const { cid } = req.params
      const response = await this.service.delete(cid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const cartController = new CartsController(cartService, productService)
