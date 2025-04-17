import { productService } from 'root/services/productService.js'

class ProductsController {
  constructor (service) {
    this.service = service
  }

  create = async (req, res, next) => {
    try {
      const body = req.body
      const uploadFiles = req.files.map(file => file.path)

      // Antes de guardar en MongoDB se valida que no exista el codigo en alguno de los productos ya existentes
      // const existingProduct = await Product.findOne({ code: productBody.code })
      // if (existingProduct) {
      //   if (uploadFiles.length > 0) {
      //     await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
      //   }
      //   throw createHttpError(404, `The code ${productBody.code} is already registered`)
      // }

      // Preparacion de datos del producto para su almacenamiento
      const productData = {
        body,
        uploadFiles
      }

      // Almacenamiento del producto en MongoDB
      const response = await this.service.create(productData)

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req, res, next) => {
    try {
      let reqQuerys = req.query

      reqQuerys = {
        ...reqQuerys,
        sort: { stock: -1 }
      }

      const context = {
        products: await this.service.getAll(reqQuerys)
      }

      // res.status(200).json(context)
      return res.render('productsAdmin', context)
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

  update = async (req, res, next) => {
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

      const response = await this.service.update(pid, data)

      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  changeStatus = async (req, res, next) => {
    try {
      const { pid } = req.params
      const response = await this.service.changeStatus(pid)
      // res.status(200).json({
      //   success: true,
      //   product: response
      // })
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  delete = async (req, res, next) => {
    try {
      const { pid } = req.params
      const response = await this.service.delete(pid)
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

export const productController = new ProductsController(productService)
