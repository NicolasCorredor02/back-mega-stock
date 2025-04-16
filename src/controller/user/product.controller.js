import { productService } from 'root/services/productService.js'

export class ProductsController {
  constructor (service) {
    this.service = service
  }

  getAll = async (req, res, next) => {
    try {
      const reqQuerys = req.query

      const project = {
        $project: {
          _id: 1,
          title: 1,
          thumbnails: 1,
          price: 1,
          description: 1,
          category: 1
        }
      }

      const context = {
        products: await this.service.getAll(reqQuerys, project)
      }

      return res.render('productsClient', context)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    try {
      const { pid } = req.params

      const response = await this.service.getById(pid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const productController = new ProductsController(productService)
