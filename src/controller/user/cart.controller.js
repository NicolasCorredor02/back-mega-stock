import { cartService } from 'root/services/cartService.js'

export class CartsController {
  constructor () {
    this.cartService = cartService
  }

  async create (req, res, next) {
    try {
      const body = req.body

      const response = await this.cartService.create(body)

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  async getById (req, res, next) {
    try {
      const { cid } = req.params
      let response = null

      if (cid) {
        response = await this.cartService.getById(cid)
      }

      const context = {
        response
      }

      return res.render('cartClient', context)
      // res.status(200).json(context)
    } catch (error) {
      next(error)
    }
  }
}

export const cartController = new CartsController(cartService)
