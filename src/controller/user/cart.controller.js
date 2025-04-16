import { cartService } from 'root/services/cartService.js'

export class CartsController {
  constructor (service) {
    this.service = service
  }

  getById = async (req, res, next) => {
    try {
      const { cid } = req.params
      let response = null

      if (cid) {
        response = await this.service.getById(cid)
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
