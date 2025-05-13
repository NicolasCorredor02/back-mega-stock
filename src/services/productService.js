/* eslint-disable no-useless-catch */
import RepositoryFactory from 'root/repositories/factory.js'
import CustomError from 'root/utils/customError.js'
import { socketModule } from 'root/sockets/socket.js'
import { deleteCloudinaryImages } from 'root/config/cloudinary.js'
import {
  pathImagesProducts,
  productUrlImageDefault
} from 'root/utils/paths.js'

class ProductService {
  constructor () {
    // Se obtiene el repository de products
    this.productRepository = RepositoryFactory.getProductRepository()
  }

  async create (data) {
    try {
      const { body, uploadFiles } = data

      // Eliminar campo de deleteImages del body
      delete body.deleteImages

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

      // const response = await this.dao.create(productData)
      const response = await this.productRepository.create(productData)

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

  async getAll (filter = {}, options = {}) {
    try {
      return await this.productRepository.getAll(filter, options)
    } catch (error) {
      throw new CustomError('Error al obtener datos', 500)
    }
  }

  async getById (id) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.productRepository.getById(id)

      if (!response) throw new CustomError('Product not found', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  async update (id, data) {
    // Verificar que data exista antes de continuar
    if (!data) {
      throw new CustomError('Data object is required for update', 400)
    }

    try {
      const { body = {}, files = [], deleteImages = null } = data

      // Validación del ID
      if (!id || id.trim === '') {
        throw new CustomError("Product's ID is required", 404)
      }

      // Validacion si el producto viene con id para actualizar
      if (body && body.id) {
        throw new CustomError('Error, product ID can not be updated', 404)
      }

      // Recuperar el producto que se quiere actualizar
      const currentProduct = await this.getById(id)
      if (!currentProduct) throw new CustomError('Product not found', 404)

      let updatedThumbnails = [...currentProduct.thumbnails] // Inicilizacion de array con las imagenes actuales

      // Eliminar imagenes especificas si se solicita
      if (deleteImages && deleteImages.length > 0) {
        console.log('Images to Delte:', deleteImages)
        // Filtrar las imagenes que se van a mantener
        updatedThumbnails = updatedThumbnails.filter(
          (url) => !deleteImages.includes(url)
        )

        // Eliminar de Cloudinary solo las imagenes que no son la default
        const imagesToDeleteFromCloud = deleteImages.filter(
          (url) => url !== productUrlImageDefault
        )
        if (imagesToDeleteFromCloud.length > 0) {
          await deleteCloudinaryImages(
            pathImagesProducts,
            imagesToDeleteFromCloud
          )
        }

        console.log('Thumbnails después de eliminar:', updatedThumbnails)
      }

      // Agregar nuevas imagenes si se envian por form-data
      if (files && files.length > 0) {
        // Validacion para que no superen las 5 imagenes
        if (updatedThumbnails.length + files.length > 5) {
          // Roll back de las imagenes subidas ya que superan las 5
          const newImagesUrls = files.map((file) => file.path)
          await deleteCloudinaryImages(pathImagesProducts, newImagesUrls)

          throw new CustomError(
            'A maximum of 5 images per product is allowed',
            404
          )
        }

        // Obtener las URLs de las nuevas imagenes
        const newImagesUrls = files.map((file) => file.path)
        console.log('Nuevas imagenes a agregar:', newImagesUrls)

        // Si la unica imagen es la default, se remplaza con las nuevas
        if (
          updatedThumbnails.length === 1 &&
          updatedThumbnails[0] === productUrlImageDefault
        ) {
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

      delete updatedData.deleteImages

      const response = await this.productRepository.update(id, updatedData)

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
      const { files = [] } = data || {}
      if (files && Array.isArray(files) && files.length > 0) {
        const uploadFiles = files.map((file) => file.path)
        if (uploadFiles > 0) {
          await deleteCloudinaryImages(pathImagesProducts, uploadFiles)
        }
      }
      throw error
    }
  }

  async changeStock (products) {
    // Verificar que products exista y sea un array
    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new CustomError(
        'Products array is required and cannot be empty',
        400
      )
    }

    const rollBackProducts = await Promise.all(
      products.map(async (productObj) => {
        if (!productObj || !productObj.product) {
          throw new CustomError(
            'Invalid product object in products array',
            400
          )
        }
        return this.getById(productObj.product)
      })
    )

    // Filtrar cualquier producto nulo que pueda haber resultado de getById
    const validRollBackProducts = rollBackProducts.filter(
      (product) => product !== null && product !== undefined
    )

    try {
      // Verificar stock disponible primero
      for (const productObj of products) {
        if (!productObj || !productObj.product) {
          throw new CustomError('Invalid product object', 400)
        }

        const productId = productObj.product
        const productQuantity = productObj.quantity || 0

        const dbProduct = await this.getById(productId)
        if (!dbProduct) {
          throw new CustomError(`Product with id ${productId} not found`, 404)
        }

        if (dbProduct.stock - productQuantity < 0) {
          throw new CustomError(
            `Error, insufficient units in stock for product ${productId}`
          )
        }
      }

      // Actualizar el stock si todas las validaciones pasan
      for (const productObj of products) {
        const productId = productObj.product
        const productQuantity = productObj.quantity || 0
        const dbProduct = await this.getById(productId)

        // Solo pasar los datos necesarios al método update
        const updateData = {
          body: {
            stock: dbProduct.stock - productQuantity
          }
        }

        const productStockUpdated = await this.update(productId, updateData)
        if (!productStockUpdated) {
          throw new CustomError(
            `Error, updating stock for product ${productId}`
          )
        }
      }

      return true
    } catch (error) {
      console.error('Error during stock update:', error)
      try {
        // Restaurar stock solo para productos válidos
        for (const product of validRollBackProducts) {
          if (product && product.id) {
            await this.update(product.id, {
              body: {
                stock: product.stock
              }
            })
          }
        }
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError)
      }
      throw error
    }
  }

  async changeStatus (id) {
    try {
      if (!id || id.trim === '') {
        throw new CustomError("Product's ID is required", 404)
      }

      const response = await this.update(id, { status: false })

      if (!response) {
        throw new CustomError("Satatus's product not changed", 404)
      }

      try {
        const { id } = await response
        socketModule.emitDeletedProduct(id)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  async delete (id) {
    try {
      if (!id || id.trim === '') {
        throw new CustomError("Product's ID is required", 404)
      }

      const productToDelete = await this.getById(id)

      // Se recuperan las urls de las imagenes del producto
      const { thumbnails } = await productToDelete
      if (
        thumbnails &&
        thumbnails.length > 0 &&
        thumbnails[0] !== productUrlImageDefault
      ) {
        // Se eliminan las imagenes que se encuentran alojadas en Cloudinary
        await deleteCloudinaryImages(pathImagesProducts, thumbnails)
      }

      const response = await this.productRepository.delete(id)

      if (!response) throw new CustomError('Producto not deleted', 404)

      try {
        const { id } = await response
        socketModule.emitDeletedProduct(id)
      } catch (error) {
        socketModule.emitSocketError()
      }

      return response
    } catch (error) {
      throw error
    }
  }
}

export const productService = new ProductService()
