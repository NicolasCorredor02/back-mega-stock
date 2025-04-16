/* eslint-disable no-useless-catch */
import CustomError from 'root/utils/customError.js'
import { productDao } from 'root/daos/mongodb/productDao.js'
import { socketModule } from 'root/sockets/socket.js'
import { deleteCloudinaryImages } from 'root/config/cloudinary.js'
import {
  pathImagesProducts,
  productUrlImageDefault
} from 'root/utils/paths.js'

class ProductService {
  constructor (dao) {
    this.dao = dao
  }

  create = async (data) => {
    try {
      const { body, uploadFiles } = data

      if (!body) {
        if (uploadFiles.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
        throw new CustomError('Product and product details are required', 404)
      }

      if (uploadFiles.length > 5) {
        if (uploadFiles.length > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
        throw new CustomError('Maximum 5 images allowed', 404)
      }

      let productData = {
        ...body,
        price: parseFloat(body.price),
        stock: parseInt(body.stock)
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

      const response = await this.dao.create(productData)

      if (!response) throw new CustomError('Producto not created', 404)

      // Emision de evento despues de agregar el product
      try {
        socketModule.emitAddProduct(response)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      const { uploadFiles } = data
      if (uploadFiles > 0) {
        await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
      }
      throw error
    }
  }

  getAll = async (reqQuerys, project = null) => {
    try {
      // Se define el pipeline de base
      const pipeline = []

      if (Object.keys(reqQuerys).length > 0) {
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
            if (paramConfig.type === 'text' && (reqQuerys.search)) {
              const searchTerms = reqQuerys.search.split('-').map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
              const orMatches = value.map((param) => ({
                [param]: {
                  $regex: searchTerms.join('|'),
                  $options: 'i'
                }
              }))
              matchConditions.$or = orMatches
            } else if (paramConfig.type === 'exact' && (reqQuerys.category)) {
              matchConditions[paramConfig.field] = reqQuerys.category.toLowerCase()
            }
          }
        })

        // Se pushean las condiciones al pipeline en caso de que se hayan encontrado por query params
        if (Object.keys(matchConditions).length > 0) {
          pipeline.push({ $match: matchConditions })
          if (project) { pipeline.push({ ...project }) }
        }
      }

      // Construccion de los parametros para el paginate
      const { page, limit } = reqQuerys

      const paginateParams = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        ...reqQuerys
      }

      const pipelineValue = pipeline.length > 0 ? pipeline : [{ $match: {} }]

      return await this.dao.getAll(pipelineValue, paginateParams)
    } catch (error) {
      throw new Error(error)
    }
  }

  getById = async (id) => {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.getById(id)

      if (!response) throw new CustomError('Product not found', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  update = async (id, data) => {
    try {
      const { body, files, deleteImages } = data

      // Validación del ID
      if (!id || id.trim === '') throw new CustomError("Product's ID is required", 404)

      // Validacion si el producto viene con id para actualizar
      if (body._id) throw new CustomError('Error, product ID can not be updated', 404)

      // Recuperar el producto que se quiere actualizar
      const currentProduct = await this.dao.getById(id)
      if (!currentProduct) throw new CustomError('Product not found', 404)

      // Validacion sobre el codigo para que este sea unico
      if (body.code && body.code !== currentProduct.code) {
        const existingProduct = await this.dao.codeExist({ code: body.code })
        if (existingProduct) throw new CustomError(`The code ${body.code} is already registered`, 404)
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

          throw new CustomError('A maximum of 5 images per product is allowed', 404)
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
      const updatedData = {
        ...body,
        thumbnails: updatedThumbnails,
        price: body.price ? parseFloat(body.price) : currentProduct.price,
        stock: body.stock ? parseInt(body.stock) : currentProduct.stock
      }

      const response = await this.dao.update(id, updatedData)

      if (!response) throw new CustomError('Producto not updated', 404)

      // Emitit Socket de producto actulizado
      try {
        socketModule.emitUpdatedProduct(response)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      // Eliminar imagenes subidas en caso de error
      const { files } = data
      const uploadFiles = files.map(file => file.path)
      if (uploadFiles > 0) {
        await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
      }
      throw error
    }
  }

  changeStatus = async (id) => {
    try {
      if (!id || id.trim === '') throw new CustomError("Product's ID is required", 404)

      const response = await this.dao.update(id, { status: false })

      if (!response) throw new CustomError("Satatus's product not changed", 404)

      try {
        const { _id } = await response
        socketModule.emitDeletedProduct(_id)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  delete = async (id) => {
    try {
      if (!id || id.trim === '') throw new CustomError("Product's ID is required", 404)

      const response = await this.dao.delete(id)

      if (!response) throw new CustomError('Producto not deleted', 404)

      // Se recuperan las urls de las imagenes del producto
      const { thumbnails } = await response

      if (thumbnails && thumbnails.length > 0 && (thumbnails[0] !== productUrlImageDefault)) {
        // Se eliminan las imagenes que se encuentran alojadas en Cloudinary
        await deleteCloudinaryImages(pathImagesProducts, thumbnails)
      }

      try {
        const { _id } = await response
        socketModule.emitDeletedProduct(_id)
      } catch (error) {
        socketModule.emitSocketError()
      }

      return response
    } catch (error) {
      throw error
    }
  }
}

export const productService = new ProductService(productDao)
