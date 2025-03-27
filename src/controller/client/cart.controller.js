import { CartsManager } from 'root/managers/cart.manager.js'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'

export class CartsController {
  static async getCartById (req, res, next) {
    try {
      const { cid } = req.params

      let cart = null

      if (cid) {
        if (!cid || cid.trim() === '') {
          throw createHttpError(404, 'Id cart is required')
        }

        if (!mongoose.Types.ObjectId.isValid(cid)) {
          throw createHttpError(404, 'Invalid cart ID format')
        }
        cart = await CartsManager.getCartById(cid)
      }

      const context = {
        cart
      }

      return res.render('cartClient', context)

      // res.status(200).json(cart)
    } catch (error) {
      next(error)
    }
  }
}
