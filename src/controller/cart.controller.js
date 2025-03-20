import { CartsManager } from 'root/managers/cart.manager.js'
import createHttpError from 'http-errors'

export class CartsController {
  static async createCart (req, res, next) {
    try {
      const cartBody = req.body
      if (!cartBody) {
        throw createHttpError(404, "Cart's details is required")
      }

      const cartData = {
        ...cartBody,
        sub_total: parseFloat(cartBody.sub_total)
      }

      const newCart = await CartsManager.createCart(cartData)
      res.status(200).json(newCart)
    } catch (error) {
      next(error)
    }
  }

  static async getCart (req, res, next) {
    try {
      const { cid } = req.params

      if (!cid || cid.trim() === '') {
        throw createHttpError(404, 'Id cart is required')
      }

      // Verificar que sea un número válido
      const numCid = parseInt(cid)
      if (isNaN(numCid) || numCid <= 0) {
        throw createHttpError(404, 'ID must be a positive number')
      }

      const resultCartById = await CartsManager.getCart(cid)
      res.status(200).json(resultCartById)
    } catch (error) {
      next(error)
    }
  }

  static async addProductCart (req, res, next) {
    try {
      const { cid } = req.params
      const product = req.body

      if (!cid || cid.trim() === '' || !product) {
        throw createHttpError(404, 'Cart id & product details are required')
      }

      // Verificar que sea un número válido
      const numCid = parseInt(cid)
      if (isNaN(numCid) || numCid <= 0) {
        throw createHttpError(404, 'ID must be a positive number')
      }

      const resultAddProductCart = await CartsManager.addProductCart(
        cid,
        product
      )
      res.status(200).json(resultAddProductCart)
    } catch (error) {
      next(error)
    }
  }
}
