import { cartService } from 'root/services/cartService.js'
import { productService } from 'root/services/productService.js'

export class CartsController {
  constructor () {
    this.cartService = cartService
    this.productService = productService
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

  async getAll (req, res, next) {
    try {
      // Extraemos query params para filtrado y paginación
      const { limit = 10, page = 1, sort, category } = req.query

      // Creamos el objeto de filtros
      const filter = {}
      if (category) filter.category = category

      // Opciones de paginación y ordenamiento
      const options = {
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }

      if (sort) {
        const [field, order] = sort.split(':')
        options.orderBy = { [field]: order === 'desc' ? 'desc' : 'asc' }
      }

      const context = {
        products: await this.productService.getAll(filter, options),
        carts: await this.cartService.getAllWithProducts()
      }

      // res.status(200).json(context)

      console.log(context.carts)

      return res.render('cartsAdmin', context)
    } catch (error) {
      next(error)
    }
  }

  async getById (req, res, next) {
    try {
      const { cid } = req.params

      const response = await this.cartService.getById(cid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      const { cid } = req.params
      const body = req.body

      const response = await this.cartService.update(cid, body)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      const { cid } = req.params
      const response = await this.cartService.delete(cid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const cartController = new CartsController()
