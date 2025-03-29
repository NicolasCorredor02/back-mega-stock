/* eslint-disable no-useless-catch */
import mongoose from 'mongoose'
import Product from 'root/models/product.model.js'

export class ProductsManager {
  /**
   *
   * @param {string} category
   * @returns {array} All products or all products by category
   */
  static async getProducts (pipeline, paginateParams) {
    try {
      // Implementacion de mongoose paginate
      const optionsPaginate = {
        ...paginateParams,
        sort: { stock: -1 }
      }

      const productsPipeline = Product.aggregate(pipeline)

      const productsPaginate = await Product.aggregatePaginate(productsPipeline, optionsPaginate)

      return productsPaginate
    } catch (error) {
      throw error
    }
  }
  // static async getProducts (category) {
  //   try {
  //     const filter = category ? { category: category.toLocaleLowerCase() } : {}
  //     return await Product.find(filter).lean()
  //   } catch (error) {
  //     throw error
  //   }
  // }

  /**
   *
   * @param {number} id
   * @returns {object} Object finded by id
   */
  static async getProductById (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const product = await Product.findById(id).lean()
      if (!product) throw new Error('Product not found')
      return product
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {number} limit
   * @param {string} category
   * @returns {array} Array with objects
   */
  static async getLimitProducts (limit, category) {
    try {
      const options = {
        limit: parseInt(limit) || 10
      }
      const filter = category ? { category: category.toLocaleLowerCase() } : {}
      return await Product.filter(filter, options).lean()
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {object} productData
   * @returns {object} new product added
   */
  static async addProduct (productData) {
    try {
      const newProduct = new Product(productData)
      await newProduct.save()
      return newProduct
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {string} id
   * @param {object} updates
   * @returns {object} objecto updated
   */
  static async updateProduct (id, updates) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      )

      if (!updatedProduct) throw new Error('Product not found')
      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {String} id
   * @returns {object} Objecto con el nuevo status
   */
  static async changeStatus (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const changedProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { status: false } },
        { new: true, runValidators: true }
      )
      if (!changedProduct) throw new Error('Product not found')
      return changedProduct
    } catch (error) {
      throw error
    }
  }

  /**
   * @param {String} id
   * @returns {object} Objecto eliminado
   */
  static async deleteProduct (id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID format')
      }
      const deletedProduct = await Product.findByIdAndDelete(id)
      if (!deletedProduct) throw new Error('Product not found')
      return deletedProduct
    } catch (error) {
      throw error
    }
  }
}
