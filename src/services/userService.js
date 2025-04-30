/* eslint-disable no-useless-catch */
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import CustomError from 'root/utils/customError.js'
import { userDao } from 'root/daos/mongodb/userDao.js'
import { socketModule } from 'root/sockets/socket.js'
import { addressService } from 'root/services/addressService.js'
import { paymentMethodService } from 'root/services/paymentMethodService.js'
import { deleteCloudinaryImage } from 'root/config/cloudinary.js'
import { pathImagesUsers, userUrlImageDefault } from 'root/utils/paths.js'
import { createHash, isValidPassword } from 'root/utils/users.js'

class UserService {
  constructor (dao) {
    this.dao = dao
  }

  register = async (data) => {
    try {
      const { body, uploadFile } = data

      if (!body) {
        if (uploadFile !== '' || uploadFile !== null) {
          await deleteCloudinaryImage(pathImagesUsers, uploadFile)
        }
        throw new CustomError("User's details is required", 400)
      }

      const userExist = await this.dao.getByEmail(body.email)
      if (userExist) throw new CustomError('User already exist', 400)
      //   if (uploadFile || uploadFile !== ' ') {
      //     await deleteCloudinaryImage(pathImagesUsers, uploadFile)
      //     throw new CustomError('Maximum 1 image allowed', 404)
      //   }

      const userData = {
        ...body,
        password: createHash(body.password),
        image_profile: uploadFile || userUrlImageDefault
      }

      const response = await this.dao.create(userData)
      if (!response) throw new CustomError('User not created', 400)

      try {
        socketModule.emitAddUser(response)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  login = async (email, password) => {
    try {
      const userExist = await this.dao.getByEmail(email)
      if (!userExist) throw new CustomError("User's credentials incorrect", 400)
      const passValid = isValidPassword(password, userExist.password)
      if (!passValid) throw new CustomError("User's credentials incorrect", 400)
      return userExist
    } catch (error) {
      throw error
    }
  }

  loginAdmin = async (email, password) => {
    try {
      const response = await this.dao.loginAdmin(email, password)
      if (!response) throw new CustomError("User's credentials not accepted", 400)
      return response
    } catch (error) {
      throw error
    }
  }

  generateToken = (user) => {
    const payload = {
      ...user
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30m'
    })
  }

  getAll = async (reqQuerys) => {
    try {
      const pipeline = [
        // lookup para las direcciones en el array de addresses
        {
          $lookup: {
            from: 'addresses',
            localField: 'addresses.address',
            foreignField: 'id',
            as: 'joinedAddresses'
          }
        },

        // Transformacion del array de direcciones joinedAddresses
        {
          $addFields: {
            addresses: {
              $map: {
                input: '$addresses',
                as: 'addressItem',
                in: {
                  address: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$joinedAddresses',
                          as: 'joinedAddress',
                          cond: {
                            $eq: [
                              '$$joinedAddress.id',
                              '$$addressItem.address'
                            ]
                          }
                        }
                      },
                      0
                    ]
                  },
                  is_default: '$$addressItem.is_default'
                }
              }
            }
          }
        },

        // lookup para los metodos de pago del usuario
        {
          $lookup: {
            from: 'paymentmethods',
            localField: 'payment_methods.payment_method',
            foreignField: 'id',
            as: 'joinedPaymentMethods'
          }
        },

        // Transformar el array de metodos de pago joinedPaymentMethods
        {
          $addFields: {
            payment_methods: {
              $map: {
                input: '$payment_methods',
                as: 'paymentItem',
                in: {
                  payment_method: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$joinedPaymentMethods',
                          as: 'joinedPayment',
                          cond: {
                            $eq: [
                              '$$joinedPayment.id',
                              '$$paymentItem.payment_method'
                            ]
                          }
                        }
                      },
                      0
                    ]
                  },

                  is_default: '$$paymentItem.is_default'
                }
              }
            }
          }
        },

        // Lookup para los carritos en commerce_data.carts
        {
          $lookup: {
            from: 'carts',
            localField: 'commerce_data.carts.cart',
            foreignField: 'id',
            as: 'joinedCarts'
          }
        },

        // Transformar el array de carritos joinedCarts
        {
          $addFields: {
            'commerce_data.carts': {
              $map: {
                input: '$commerce_data.carts',
                as: 'cartItem',
                in: {
                  cart: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$joinedCarts',
                          as: 'joinedCart',
                          cond: {
                            $eq: ['$$joinedCart.id', '$$cartItem.cart']
                          }
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

        // Se hace lookups adicionales para los datos dentro de cada carrito
        {
          $lookup: {
            from: 'addresses',
            localField: 'joinedCarts.address',
            foreignField: 'id',
            as: 'cartAddresses'
          }
        },

        {
          $lookup: {
            from: 'paymentmethods',
            localField: 'joinedCarts.payment_method',
            foreignField: 'id',
            as: 'cartPaymentMethods'
          }
        },

        {
          $lookup: {
            from: 'products',
            localField: 'joinedCarts.products.product',
            foreignField: 'id',
            as: 'cartProducts'
          }
        },

        // Transformar cada carrito para incluir los datos completos
        {
          $addFields: {
            'commerce_data.carts': {
              $map: {
                input: '$commerce_data.carts',
                as: 'cartItem',
                in: {
                  cart: {
                    $mergeObjects: [
                      '$$cartItem.cart',
                      {
                        address: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$cartAddresses',
                                as: 'addr',
                                cond: {
                                  $eq: [
                                    '$$addr.id',
                                    '$$cartItem.cart.address'
                                  ]
                                }
                              }
                            },
                            0
                          ]
                        },
                        payment_method: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: '$cartPaymentMethods',
                                as: 'pm',
                                cond: {
                                  $eq: [
                                    '$$pm.id',
                                    '$$cartItem.cart.payment_method'
                                  ]
                                }
                              }
                            },
                            0
                          ]
                        },
                        products: {
                          $map: {
                            input: '$$cartItem.cart.products',
                            as: 'prod',
                            in: {
                              quantity: '$$prod.quantity',
                              product: {
                                $arrayElemAt: [
                                  {
                                    $filter: {
                                      input: '$cartProducts',
                                      as: 'p',
                                      cond: {
                                        $eq: ['$$p.id', '$$prod.product']
                                      }
                                    }
                                  },
                                  0
                                ]
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        },

        // Eliminar campos temporales
        {
          $project: {
            joinedAddresses: 0,
            joinedPaymentMethods: 0,
            joinedCarts: 0,
            cartAddresses: 0,
            cartPaymentMethods: 0,
            cartProducts: 0
          }
        }
      ]

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

  getByEmail = async (email) => {
    try {
      if (!email || email.trim === '') throw new CustomError('Email is required', 400)

      const response = await this.dao.getByEmail(email)

      // if (!response) return new CustomError('User not found', 400)

      return response
    } catch (error) {
      throw error
    }
  }

  getById = async (id) => {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.getById(id)

      if (!response) throw new CustomError('User not founded', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  update = async (id, data) => {
    try {
      const {
        body,
        fileUrl,
        newAddress,
        newPaymentMethod,
        deleteImage,
        addressesToDelete,
        paymentMethodsToDelete
      } = data

      if (!id || id.trim === '') {
        throw new CustomError("User's ID is required", 404)
      }

      if (body.id) {
        throw new CustomError('Error, user ID can not be updated', 404)
      }

      const currentUser = await this.dao.getById(id)
      if (!currentUser) throw new CustomError('User not found', 404)

      // Se agregan las direcciones y metodos de pago actuales y nuevos
      let addresses = [...currentUser.addresses]
      let paymentMethods = [...currentUser.payment_methods]

      // Eliminar las direccines o metodos de pago que llegan por body en addressesToDelete y paymentMethodsToDelete
      if (addressesToDelete && addressesToDelete.length > 0) {
        addresses = addresses.filter(
          (address) => !addressesToDelete.includes(address)
        )
      }

      if (paymentMethodsToDelete && paymentMethodsToDelete.length > 0) {
        paymentMethods = paymentMethods.filter(
          (paymentMethod) => !paymentMethodsToDelete.include(paymentMethod)
        )
      }

      // Se agregan la nueva direccion o metodo de pago
      if (newAddress && addresses.length < 5) {
        const newAddressResponse = await addressService.create({
          ...newAddress,
          is_saved: true
        })
        if (!newAddressResponse) {
          throw new CustomError('The new Addres could not be created', 404)
        }
        addresses.push({ address: newAddressResponse.id, is_default: false })
      }

      if (newPaymentMethod && paymentMethods.length < 5) {
        const newPaymentMethodResponse = await paymentMethodService.create({
          ...newPaymentMethod,
          is_saved: true
        })
        if (!newPaymentMethodResponse) {
          throw new CustomError(
            'The new Payment method could not be created',
            404
          )
        }
        paymentMethods.push({
          payment_method: newPaymentMethodResponse.id,
          is_default: false
        })
      }

      // Se recupera la actual image profile del usuario
      let updatedImageProfile = currentUser.image_profile

      // Eliminar imagen de perfil tanto de Cloudinary como del usuario
      if (deleteImage) {
        console.log('Image to Delete:', deleteImage)
        if (deleteImage !== userUrlImageDefault) {
          updatedImageProfile = ''
          await deleteCloudinaryImage(pathImagesUsers, deleteImage)
        }
        console.log('Image profile despues de eliminar:', updatedImageProfile)
      }

      // Se agrega la nueva imagen que viene por form data
      if (fileUrl) {
        console.log('Nueva imagen a agregar:', fileUrl)
        updatedImageProfile = fileUrl
        console.log(
          'Image profile luego de agregar la nueva:',
          updatedImageProfile
        )
      }

      // En el caso de que no quede ninguna imagen, se usa la imagen por default
      if (updatedImageProfile === '') {
        updatedImageProfile = userUrlImageDefault
        console.log('Se asigno la imgen por defecto')
      }

      const updatedData = {
        ...body,
        addresses,
        payment_methods: paymentMethods,
        image_profile: updatedImageProfile
      }

      const response = await this.dao.update(id, updatedData)
      if (!response) throw new CustomError('User not updated', 404)

      try {
        socketModule.emitUpdatedUser(response)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  changeStatus = async (id) => {
    try {
      if (!id || id.trim === '') {
        throw new CustomError("User's ID is required", 404)
      }

      const response = await this.dao.update(id, { status: false })

      if (!response) throw new CustomError("Statu's user not changed", 404)

      try {
        const { id } = await response
        socketModule.emitDeletedUser(id)
      } catch (error) {
        socketModule.emitSocketError(error)
      }
    } catch (error) {
      throw error
    }
  }

  delete = async (id) => {
    try {
      if (!id || id.trim === '') {
        throw new CustomError("User's ID is required", 404)
      }

      const response = await this.dao.delete(id)

      if (!response) throw new CustomError('User not deleted', 404)

      // Se recupera la imagen de perfil del usuario para ser eliminada
      // eslint-disable-next-line camelcase
      const { image_profile } = await response

      // eslint-disable-next-line camelcase
      if (image_profile && image_profile !== userUrlImageDefault) {
        await deleteCloudinaryImage(pathImagesUsers, image_profile)
      }

      try {
        const { id } = await response
        socketModule.emitDeletedUser(id)
      } catch (error) {
        socketModule.emitSocketError(error)
      }

      return response
    } catch (error) {
      throw error
    }
  }
}

export const userService = new UserService(userDao)
