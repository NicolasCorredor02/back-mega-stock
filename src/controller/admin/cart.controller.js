import { CartsManager } from 'root/managers/cart.manager.js'
import { ProductsManager } from 'root/managers/product.manager.js'
import createHttpError from 'http-errors'
import Cart from 'root/models/cart.model.js'
import mongoose from 'mongoose'

export class CartsController {
  static async createCart (req, res, next) {
    try {
      const cartBody = req.body

      console.log('CartBody:', cartBody)

      if (!cartBody) {
        throw createHttpError(404, "Cart's details is required")
      }

      const cartData = {
        ...cartBody,
        sub_total: parseFloat(cartBody.sub_total)
      }

      console.log('CartData:', cartData)

      const newCart = await CartsManager.createCart(cartData)
      res.status(200).json(newCart)
    } catch (error) {
      next(error)
    }
  }

  static async getAllCarts (req, res, next) {
    try {
      const context = {
        products: await ProductsManager.getProducts([{ $match: {} }]),
        carts: await CartsManager.getAllCarts()
      }

      return res.render('cartsAdmin', context)

      // res.status(200).json(allCarts)
    } catch (error) {
      next(error)
    }
  }

  static async getAllCartsJSON (req, res, next) {
    try {
      const allCarts = await CartsManager.getAllCarts()

      res.status(200).json(allCarts)
    } catch (error) {
      next(error)
    }
  }

  static async getCartById (req, res, next) {
    try {
      const { cid } = req.params

      if (!cid || cid.trim() === '') {
        throw createHttpError(404, 'Id cart is required')
      }

      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw createHttpError(404, 'Invalid cart ID format')
      }
      const cart = await CartsManager.getCartById(cid)
      res.status(200).json(cart)
    } catch (error) {
      next(error)
    }
  }

  static async updateCartData (req, res, next) {
    try {
      const { cid } = req.params
      const cartBody = req.body

      if (!cid || cid.trim() === '' || !cartBody) {
        throw createHttpError(404, 'Cart id & product details are required')
      }

      if (!mongoose.Types.ObjectId.isValid(cid)) { throw createHttpError(404, 'Invalid cart ID format') }

      if (
        cartBody._id ||
        cartBody.user_type ||
        cartBody.address ||
        cartBody.payment_method
      ) {
        throw createHttpError(
          404,
          'Error, cart ID and user type can not be updated'
        )
      }

      const currentCart = await Cart.findById(cid)
      if (!currentCart) throw createHttpError(404, 'Cart not found')

      const updateData = {
        ...cartBody,
        sub_total: cartBody.sub_total
          ? parseFloat(cartBody.sub_total)
          : currentCart.sub_total
      }

      const updatedCart = await CartsManager.updateCartData(cid, updateData)

      // TODO: Hacer el evento socket para actualizar el producto en vivo
      res.status(200).json(updatedCart)
    } catch (error) {
      next(error)
    }
  }

  static async deleteCart (req, res, next) {
    try {
      const { cid } = req.query

      if (!cid || cid.trim() === '') throw createHttpError(404, "Cart's ID is required")

      if (!mongoose.Types.ObjectId.isValid(cid)) throw createHttpError(404, 'Invalid cart ID format')

      const deletedCart = await CartsManager.deleteCart(cid)
      // TODO: Hacer el evento socket para eliminar el producto en vivo

      res.status(200).json(deletedCart)
    } catch (error) {
      next(error)
    }
  }
}
