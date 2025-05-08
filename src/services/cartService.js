/* eslint-disable no-useless-catch */
import CustomError from 'root/utils/customError.js'
import RepositoryFactory from 'root/repositories/factory.js'
import { addressService } from 'root/services/addressService.js'
import { paymentMethodService } from 'root/services/paymentMethodService.js'
import { productService } from 'root/services/productService.js'
import { socketModule } from 'root/sockets/socket.js'

class CartService {
  constructor () {
    // this.dao = dao
    this.cartRepository = RepositoryFactory.getCartRepository()
  }

  async create (data) {
    let addressRollBack = ''
    let payMethodRollBack = ''

    try {
      const { address, paymentMethod, products } = data
      if (!data) throw new CustomError("Cart's details is required", 404)

      let addressId = null
      let paymentMethodId = null

      if (!address.id || address.id.trim() === '' || address.id === undefined) {
        // Se crea el address que llegan por data
        const { id } = await addressService.create(address)
        if (!id) throw new CustomError('Error creating address', 404)
        addressId = id
        addressRollBack = id
      } else {
        addressId = address.id
      }

      if (
        !paymentMethod.id ||
        paymentMethod.id.trim() === '' ||
        paymentMethod.id === undefined
      ) {
        // Se crea el payment_method que viene por data
        const { id } = await paymentMethodService.create(paymentMethod)
        if (!id) throw new CustomError('Error creating payment method', 404)
        paymentMethodId = id
        payMethodRollBack = id
      } else {
        paymentMethodId = paymentMethod.id
      }

      // Proceso para realizar la actualizacion del stock de los productos que se quieren comprar
      const updateStockProducts = await productService.changeStock(products)
      if (!updateStockProducts) { throw new CustomError('Error, updating the units in stock of the products', 404) }

      const cartData = {
        ...data,
        user_type: data.user_type || 'guest',
        user_info: {
          ...data.user_info,
          id_number: parseInt(data.user_info.id_number)
        },
        address: addressId,
        payment_method: paymentMethodId,
        sub_total: parseFloat(data.sub_total)
      }

      const response = await this.cartRepository.create(cartData)
      if (!response) {
        throw new CustomError('Cart not created', 404)
      }

      // Emision de evento de cartAdded
      try {
        socketModule.emitAddCart(response)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      if (addressRollBack || addressRollBack.trim() !== '') {
        // Se crea el address que llegan por data
        const response = await addressService.delete(addressRollBack)
        if (!response) throw new CustomError('Error in catch deleting address', 404)
      }

      if (payMethodRollBack || payMethodRollBack.trim() !== '') {
        // Se crea el payment_method que viene por data
        const response = await paymentMethodService.delete(payMethodRollBack)
        if (!response) { throw new CustomError('Error in catch deleting payment method', 404) }
      }

      throw error
    }
  }

  async getAll (filter = {}, options = {}) {
    try {
      return await this.cartRepository.getAll(filter, options)
    } catch (error) {
      throw new CustomError('Error, finding data', 500)
    }
  }

  // getAll = async (reqQuerys) => {
  //   try {
  //     // Se define el pipeline de base
  //     const pipeline = [
  //       // Etapa para vincular la dirección
  //       {
  //         $lookup: {
  //           from: 'addresses', // Asume que tu colección se llama 'addresses'
  //           localField: 'address',
  //           foreignField: 'id',
  //           as: 'address'
  //         }
  //       },
  //       { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },

  //       // Etapa para vincular el método de pago
  //       {
  //         $lookup: {
  //           from: 'paymentmethods', // Asume que tu colección se llama 'paymentmethods'
  //           localField: 'payment_method',
  //           foreignField: 'id',
  //           as: 'payment_method'
  //         }
  //       },
  //       {
  //         $unwind: {
  //           path: '$payment_method',
  //           preserveNullAndEmptyArrays: true
  //         }
  //       },

  //       // Etapa para vincular los productos dentro del array de productos
  //       {
  //         $lookup: {
  //           from: 'products',
  //           localField: 'products.product',
  //           foreignField: 'id',
  //           as: 'joinedProducts'
  //         }
  //       },

  //       // Transformar el array de productos para incluir la información completa del producto
  //       {
  //         $addFields: {
  //           products: {
  //             $map: {
  //               input: '$products',
  //               as: 'productItem',
  //               in: {
  //                 quantity: '$$productItem.quantity',
  //                 product: {
  //                   $arrayElemAt: [
  //                     {
  //                       $filter: {
  //                         input: '$joinedProducts',
  //                         as: 'joinedProduct',
  //                         cond: {
  //                           $eq: [
  //                             '$$joinedProduct.id',
  //                             '$$productItem.product'
  //                           ]
  //                         }
  //                       }
  //                     },
  //                     0
  //                   ]
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       },

  //       // Eliminar el campo temporal de productos unidos
  //       {
  //         $project: {
  //           joinedProducts: 0
  //         }
  //       }
  //     ]

  //     // Construccion de los parametros para el paginate
  //     const { page, limit } = reqQuerys

  //     const paginateParams = {
  //       page: parseInt(page) || 1,
  //       limit: parseInt(limit) || 10,
  //       ...reqQuerys
  //     }

  //     const pipelineValue = pipeline.length > 0 ? pipeline : [{ $match: {} }]

  //     return await this.dao.getAll(pipelineValue, paginateParams)
  //   } catch (error) {
  //     throw new Error(error)
  //   }
  // }

  async getById (id) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.cartRepository.getById(id)

      if (!response) throw new CustomError('Cart not founded', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  async update (id, data) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      if (!data) throw new CustomError('Cart details are required')

      if (data.id || data.user_type || data.address || data.payment_method) {
        throw new CustomError(
          'Error, fields Id, user_type, address and payment_method can not be updated',
          404
        )
      }

      const currentCart = await this.getById(id)
      if (!currentCart) throw new CustomError('Cart not founded', 404)

      const cartUpdated = {
        ...data,
        sub_total: data.sub_total
          ? parseFloat(data.sub_total)
          : currentCart.sub_total
      }

      const response = await this.cartRepository.update(id, cartUpdated)

      if (!response) throw new CustomError('Cart not updated', 404)

      try {
        socketModule.emitUpdatedCart(response)
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
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.cartRepository.delete(id)
      if (!response) throw new CustomError('Cart not deleted', 404)

      try {
        const { id } = await response
        socketModule.emitDeletedCart(id)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }
}

export const cartService = new CartService()
