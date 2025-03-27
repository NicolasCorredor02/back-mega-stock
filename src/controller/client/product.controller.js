import { ProductsManager } from 'root/managers/product.manager.js'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'

export class ProductsController {
  // Get for clients
  static async getProducts (req, res, next) {
    try {
      const { category } = req.params

      // let products;
      let context = {}

      if (category) {
        context = {
          category,
          products: await ProductsManager.getProducts(category)
        }
      }
      context = {
        products: await ProductsManager.getProducts()
      }

      return res.render('productsClient', context)

      // if (category) {
      //   products =  await ProductsManager.getProducts(category);
      // } else {
      //   products = await ProductsManager.getProducts();
      // }
      // res.status(200).json(products);
    } catch (error) {
      next(error)
    }
  }

  static async getProductById (req, res, next) {
    try {
      const { pid } = req.params

      if (!pid || pid.trim() === '') {
        throw createHttpError(404, 'Id is required')
      }

      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw createHttpError(400, 'Invalid product ID format')
      }

      const product = await ProductsManager.getProductById(pid)

      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  static async getLimitProducts (req, res) {
    try {
      const { category } = req.params
      const { limit } = req.params

      if (!limit || limit.trim() === '') {
        throw createHttpError(404, 'Limit is required')
      }

      // Verificar que sea un número válido
      const numLimit = parseInt(limit)
      if (isNaN(numLimit) || numLimit <= 0) {
        throw createHttpError(404, 'ID must be a positive number')
      }

      let productsLimited
      if (category) {
        productsLimited = await ProductsManager.getLimitProducts(
          limit,
          category
        )
      } else {
        productsLimited = await ProductsManager.getLimitProducts(limit)
      }

      res.status(200).json(productsLimited)
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        details: error.message
      })
    }
  }
}
