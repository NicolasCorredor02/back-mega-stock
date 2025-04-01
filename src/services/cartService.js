import CustomError from 'root/utils/customError.js'
import { cartDao } from 'root/daos/mongodb/cartDao.js'
import { addressService } from 'root/services/addressService.js'
import { paymentMethodService } from 'root/services/paymentMethodService.js'
import { socketModule } from 'root/sockets/socket.js'

class CartService {
  constructor (dao) {
    this.dao = dao
  }

  create = async (data) => {
    try {
      const { address, paymentMethod } = data
      if (!data) throw new CustomError("Cart's details is required", 404)

      // Se crea el address que llegan por data
      const addressResponse = await addressService.create(address)
      if (!addressResponse) throw new CustomError('Error creating address', 404)

      // Se crea el payment_method que viene por data
      const paymenMethodResponse = await paymentMethodService.create(paymentMethod)
      if (!paymenMethodResponse) {
        await addressService.delete(addressResponse._id)
        throw new CustomError('Error creating payment method', 404)
      }

      const cartData = {
        ...data,
        user_type: data.user_type || 'guest',
        user_info: {
          ...data.user_info,
          id_number: parseInt(data.user_info.id_number)
        },
        address: addressResponse._id,
        payment_method: paymenMethodResponse._id,
        sub_total: parseFloat(data.sub_total)
      }

      const response = await this.dao.create(cartData)
      if (!response) {
        await addressService.delete(addressResponse._id)
        await paymentMethodService.delete(paymenMethodResponse._id)
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
      throw error
    }
  }

  getAll = async (reqQuerys) => {
    try {
      // Se define el pipeline de base
      const pipeline = [
        // Etapa para vincular la dirección
        {
          $lookup: {
            from: 'addresses', // Asume que tu colección se llama 'addresses'
            localField: 'address',
            foreignField: '_id',
            as: 'address'
          }
        },
        { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },

        // Etapa para vincular el método de pago
        {
          $lookup: {
            from: 'paymentmethods', // Asume que tu colección se llama 'paymentmethods'
            localField: 'payment_method',
            foreignField: '_id',
            as: 'payment_method'
          }
        },
        { $unwind: { path: '$payment_method', preserveNullAndEmptyArrays: true } },

        // Etapa para vincular los productos dentro del array de productos
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'joinedProducts'
          }
        },

        // Transformar el array de productos para incluir la información completa del producto
        {
          $addFields: {
            products: {
              $map: {
                input: '$products',
                as: 'productItem',
                in: {
                  quantity: '$$productItem.quantity',
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$joinedProducts',
                          as: 'joinedProduct',
                          cond: { $eq: ['$$joinedProduct._id', '$$productItem.product'] }
                        }
                      },
                      0
                    ]
                  }
                }
              }
            }
          }
        },

        // Eliminar el campo temporal de productos unidos
        {
          $project: {
            joinedProducts: 0
          }
        }
      ]

      // Construccion de los parametros para el paginate
      const { page = 1, limit = 10 } = reqQuerys

      const paginateParams = {
        page: parseInt(page),
        limit: parseInt(limit)
      }

      const pipelineValue = pipeline.length > 0 ? pipeline : [{ $match: {} }]

      return await this.dao.getAll(pipelineValue, paginateParams)
    } catch (error) {
      throw new Error(error)
    }
  }

  getById = async (id) => {
    try {
      if (!id || id.trim() === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.getById(id)

      if (!response) throw new CustomError('Cart not founded', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  update = async (id, data) => {
    try {
      if (!id || id.trim() === '') throw new CustomError('Id is required', 404)

      if (!data) throw new CustomError('Cart details are required')

      if (data._id || data.user_type || data.address || data.payment_method) throw new CustomError('Error, fields Id, user_type, address and payment_method can not be updated', 404)

      const currentCart = await this.dao.getById(id)
      if (!currentCart) throw new CustomError('Cart not founded', 404)

      const cartUpdated = {
        ...data,
        sub_total: data.sub_total ? parseFloat(data.sub_total) : currentCart.sub_total
      }

      const response = await this.dao.update(id, cartUpdated)

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

  delete = async (id) => {
    try {
      if (!id || id.trim() === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.delete(id)
      if (!response) throw new CustomError('Cart not deleted', 404)

      try {
        const { _id } = await response
        socketModule.emitDeletedCart(_id)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }
}

export const cartService = new CartService(cartDao)
