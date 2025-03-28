import { ProductsManager } from 'root/managers/product.manager.js'
import createHttpError from 'http-errors'
import { deleteCloudinaryImages } from 'root/config/cloudinary.js'
import { socketModule } from 'root/sockets/socket.js'
import Product from 'root/models/product.model.js'
import mongoose from 'mongoose'
import {
  pathImagesProducts,
  productUrlImageDefault
} from 'root/utils/paths.js'

export class ProductsController {
  // Get for admin
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
      return res.render('productsAdmin', context)
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

  static async addProduct (req, res, next) {
    try {
      const productBody = req.body
      const uploadFiles = req.files.map(file => file.path)

      if (!productBody) {
        if (uploadFiles.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
        throw createHttpError(404, 'Product and product details are required')
      }

      if (req.files.length > 5) {
        if (uploadFiles.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
        throw createHttpError(404, 'Maximum 5 images allowed')
      }

      // Antes de guardar en MongoDB se valida que no exista el codigo en alguno de los productos ya existentes
      const existingProduct = await Product.findOne({ code: productBody.code })
      if (existingProduct) {
        if (uploadFiles.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
        throw createHttpError(404, `The code ${productBody.code} is already registered`)
      }
      // Preparacion de datos del producto para su almacenamiento
      let productData = {
        ...productBody,
        price: parseFloat(productBody.price),
        stock: parseInt(productBody.stock)
      }

      if (uploadFiles.length === 0) {
        productData = {
          ...productData,
          thumbnails: [productUrlImageDefault]
        }
      } else {
        productData = {
          ...productData,
          thumbnails: uploadFiles
        }
      }

      // Almacenamiento del producto en MongoDB
      const newProduct = await ProductsManager.addProduct(productData)
      // Emision de evento despues de agregar el product
      try {
        socketModule.emitAddProduct(newProduct)
      } catch (error) {
        if (uploadFiles.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
        socketModule.emitSocketError(error)
      }

      res.status(201).json(newProduct)
    } catch (error) {
      const uploadFiles = req.files.map(file => file.path)
      if (uploadFiles > 0) {
        await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
      }
      next(error)
    }
  }

  static async updateProduct (req, res, next) {
    try {
      const { pid } = req.params
      const productBody = req.body
      const files = req.files
      const deleteImages = JSON.parse(productBody.deleteImages || '[]') // Obtener las urls de las imagenes que se quiren eliminar

      // Validación del ID
      if (!pid || pid.trim() === '') {
        throw createHttpError(404, "Product's ID is required")
      }

      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw createHttpError(400, 'Invalid product ID format')
      }

      // Validacion si el producto viene con id para actualizar
      if (productBody._id) {
        throw createHttpError(404, 'Error, product ID can not be updated')
      }

      // Recuperar el producto que se quiere actualizar
      const currentProduct = await Product.findById(pid)
      if (!currentProduct) {
        throw createHttpError(404, 'Product not found')
      }

      // Validacion sobre el codigo para que este sea unico
      if (productBody.code && productBody.code !== currentProduct.code) {
        const existingProduct = await Product.findOne({
          code: productBody.code
        })
        if (existingProduct) {
          throw createHttpError(
            404,
            `The code ${productBody.code} is already registered`
          )
        }
      }

      let updatedThumbnails = [...currentProduct.thumbnails] // Inicilizacion de array con las imagenes actuales

      // Eliminar imagenes especificas si se solicita
      if (deleteImages && deleteImages.length > 0) {
        console.log('Images to Delte:', deleteImages)
        // Filtrar las imagenes que se van a mantener
        updatedThumbnails = updatedThumbnails.filter(url => !deleteImages.includes(url))

        // Eliminar de Cloudinary solo las imagenes que no son la default
        const imagesToDeleteFromCloud = deleteImages.filter(url => url !== productUrlImageDefault)
        if (imagesToDeleteFromCloud.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, imagesToDeleteFromCloud)
        }

        console.log('Thumbnails después de eliminar:', updatedThumbnails)
      }

      // Agregar nuevas imagenes si se envian por form-data
      if (files && files.length > 0) {
        // Validacion para que no superen las 5 imagenes
        if (updatedThumbnails.length + files.length > 5) {
          // Roll back de las imagenes subidas ya que superan las 5
          const newImagesUrls = files.map(file => file.path)
          await deleteCloudinaryImages(pathImagesProducts, newImagesUrls)

          throw createHttpError(404, 'A maximum of 5 images per product is allowed')
        }

        // Obtener las URLs de las nuevas imagenes
        const newImagesUrls = files.map(file => file.path)
        console.log('Nuevas imagenes a agregar:', newImagesUrls)

        // Si la unica imagen es la default, se remplaza con las nuevas
        if (updatedThumbnails.length === 1 && updatedThumbnails[0] === productUrlImageDefault) {
          updatedThumbnails = newImagesUrls
        } else {
          // En el caso de que no, se agregan las nuevas
          updatedThumbnails = [...updatedThumbnails, ...newImagesUrls]
        }

        console.log('Thumbnails despues de agregar nuevas:', updatedThumbnails)
      }

      // En caso de que no queden imagenes, se usa la imagen default
      if (updatedThumbnails.length === 0) {
        updatedThumbnails = [productUrlImageDefault]
        console.log('Se asigno la imagen por defecto')
      }

      // Se actualiza el producto en la base de datos
      // Actualizacion de los demas datos del producto
      const updateData = {
        ...productBody,
        thumbnails: updatedThumbnails,
        price: productBody.price ? parseFloat(productBody.price) : currentProduct.price,
        stock: productBody.stock ? parseInt(productBody.stock) : currentProduct.stock
      }

      // Actualizaicon del producto
      const updatedProduct = await ProductsManager.updateProduct(pid, updateData)

      // Emitit Socket de producto actulizado
      try {
        socketModule.emitUpdatedProduct(updatedProduct)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      res.status(200).json(updatedProduct)
    } catch (error) {
      // Eliminar imagenes subidas en caso de error
      const uploadFiles = req.files.map(file => file.path)
      if (uploadFiles > 0) {
        await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
      }
      next(error)
    }
  }

  static async changeStatus (req, res, next) {
    try {
      const { pid } = req.query
      if (!pid || pid.trim() === '') {
        throw createHttpError(404, "Product's ID is required")
      }

      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw createHttpError(400, 'Invalid product ID format')
      }

      const changedProduct = await ProductsManager.changeStatus(pid)

      try {
        const { _id } = await changedProduct
        socketModule.emitDeletedProduct(_id)
      } catch (error) {
        socketModule.emitSocketError()
      }

      // res.status(200).json({
      //   success: true,
      //   product: changedProduct
      // })

      res.status(200).json(changedProduct)
    } catch (error) {
      next(error)
    }
  }

  static async deleteProduct (req, res, next) {
    try {
      const { pid } = req.query

      if (!pid || pid.trim() === '') {
        throw createHttpError(404, "Product's ID is required")
      }

      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw createHttpError(400, 'Invalid product ID format')
      }

      const deletedProduct = await ProductsManager.deleteProduct(pid)
      // res.status(200).json({
      //   success: true,
      //   message: 'Product deleted succesfully'
      //   product: deletedProduct
      // })

      // Se recuperan las urls de las imagenes del producto
      const { thumbnails } = await deletedProduct

      if (thumbnails && thumbnails.length > 0 && (thumbnails[0] !== productUrlImageDefault)) {
        // Se eliminan las imagenes que se encuentran alojadas en Cloudinary
        await deleteCloudinaryImages(pathImagesProducts, thumbnails)
      }

      try {
        const { _id } = await deletedProduct
        socketModule.emitDeletedProduct(_id)
      } catch (error) {
        socketModule.emitSocketError()
      }
      res.status(200).json(deletedProduct)
    } catch (error) {
      next(error)
    }
  }
}
