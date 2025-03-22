/* eslint-disable no-useless-catch */
import mongoose from 'mongoose'
import Cart from 'root/models/cart.model.js'

export class CartsManager {
  static requiredFields = ['id', 'quantity']

  /**
   *
   * @param {object} cartData
   * @returns {object}
   */
  static async createCart (cartData) {
    try {
      const newCart = new Cart(cartData)
      await newCart.save()
      return newCart
    } catch (error) {
      throw error
    }
  }

  static async getAllCarts () {
    try {
      return await Cart.find().lean()
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} id
   * @returns {array} cart array with products
   */
  static async getCartById (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid cart ID format')
      }

      const cart = await Cart.findById(id).lean()

      if (!cart) throw new Error('Cart not found')
      return cart
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} idCart
   * @param {object} produ id (number) and quantity (number) is requiered
   * @returns {object} cart
   */
  static async updateCartData (idCart, updates) {
    try {
      if (!mongoose.Types.ObjectId.isValid(idCart)) throw new Error('Invalid cart ID format')

      const updatedCart = await Cart.findByIdAndUpdate(
        idCart,
        { $set: updates },
        { new: true, runValidators: true }
      )

      if (!updatedCart) throw new Error('Cart not found')
      return updatedCart
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {String} idCart
   * @returns {Object}
   */
  static async deleteCart (idCart) {
    try {
      if (!mongoose.Types.ObjectId.isValid(idCart)) throw new Error('Invalid cart ID format')
      const deletedCart = await Cart.findOneAndDelete(idCart)
      if (!deletedCart) throw new Error('Cart not found')
      return deletedCart
    } catch (error) {
      throw error
    }
  }
}
