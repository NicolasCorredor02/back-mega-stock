import { productService } from 'root/services/productService.js'

class ProductsController {
  constructor () {
    this.productService = productService
  }

  async create (req, res, next) {
    try {
      const body = req.body
      const uploadFiles = req.files.map(file => file.path)

      // Preparacion de datos del producto para su almacenamiento
      const productData = {
        body,
        uploadFiles
      }

      // Almacenamiento del producto en MongoDB
      const response = await this.productService.create(productData)

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
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
      return res.render('productsAdmin', context)
    } catch (error) {
      next(error)
    }
  }

  async getById (req, res, next) {
    try {
      const { pid } = req.params

      const response = await this.productService.getById(pid)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async update (req, res, next) {
    try {
      const { pid } = req.params
      const body = req.body
      const files = req.files
      const deleteImages = JSON.parse(body.deleteImages || '[]') // Obtener las urls de las imagenes que se quiren eliminar

      const data = {
        body,
        files,
        deleteImages
      }

      const response = await this.productService.update(pid, data)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async changeStatus (req, res, next) {
    try {
      const { pid } = req.params
      const response = await this.productService.changeStatus(pid)
      // res.status(200).json({
      //   success: true,
      //   product: response
      // })
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      const { pid } = req.params
      const response = await this.productService.delete(pid)
      // res.status(200).json({
      //   success: true,
      //   message: 'Product deleted succesfully'
      //   product: deletedProduct
      // })
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}

export const productController = new ProductsController()
