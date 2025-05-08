import { productService } from 'root/services/productService.js'

class ProductsController {
  constructor () {
    this.productService = productService
  }

  async getAll (req, res, next) {
    try {
      // Extraemos query params para filtrado y paginación
      const {
        limit = 10,
        page = 1,
        sort,
        category,
        minPrice,
        maxPrice
      } = req.query

      // Creamos el objeto de filtros
      const filter = {}
      if (category) filter.category = category
      if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = parseFloat(minPrice)
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
      }

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
        products: await this.productService.getAll(filter, options)
      }

      // res.status(200).json(products)
      return res.render('productsClient', context)
    } catch (error) {
      next(error)
    }
  }

  // getAll = async (req, res, next) => {
  //   try {
  //     const reqQuerys = req.query

  //     const project = {
  //       $project: {
  //         _id: 1,
  //         title: 1,
  //         thumbnails: 1,
  //         price: 1,
  //         description: 1,
  //         category: 1
  //       }
  //     }

  //     const context = {
  //       products: await this.service.getAll(reqQuerys, project)
  //     }

  //     return res.render('productsClient', context)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async getById (req, res, next) {
    try {
      const { pid } = req.params

      const response = await this.productService.getById(pid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const productController = new ProductsController()
