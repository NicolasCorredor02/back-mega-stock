import { ProductsManager } from 'root/managers/product.manager.js'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'

export class ProductsController {
  // Get for clients
  static async getProducts (req, res, next) {
    try {
      const reqQuerys = req.query

      // Se define el pipeline de base
      const pipeline = []

      if (Object.keys(reqQuerys).length > 0) {
        // Se reciben todas las query params
        const queryParams = req.query

        // Se define el mapa de querys permitidas para crear sus transformaciones ante el pipeline
        const paramMapping = {
          search: {
            type: 'text',
            field: ['title', 'description']
          },
          category: {
            type: 'exact',
            field: 'category'
          }
        }

        // Objeto para guardar las coincidencias de match
        const matchConditions = {}

        Object.keys(paramMapping).forEach((param) => {
          const paramConfig = paramMapping[param]

          if (paramConfig) {
            const value = paramConfig.field

            // Manejo de busqueda por texto para filtro de productos
            if (paramConfig.type === 'text' && (queryParams.search)) {
              const searchTerms = queryParams.search.split('-').map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
              const orMatches = value.map((param) => ({
                [param]: {
                  $regex: searchTerms.join('|'),
                  $options: 'i'
                }
              }))
              matchConditions.$or = orMatches
            } else if (paramConfig.type === 'exact' && (queryParams.category)) {
              matchConditions[paramConfig.field] = queryParams.category.toLowerCase()
            }
          }
        })

        // Se pushean las condiciones al pipeline en caso de que se hayan encontrado por query params
        if (Object.keys(matchConditions).length > 0) {
          pipeline.push({ $match: matchConditions })
        }
      }

      const context = {
        products: await ProductsManager.getProducts(pipeline.length > 0 ? pipeline : [{ $match: {} }])
      }

      // products = await ProductsManager.getProducts();
      // res.status(200).json(context)

      return res.render('productsClient', context)
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
