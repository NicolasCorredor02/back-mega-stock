import PrismaProductRepository from 'root/repositories/prisma/prismaProductRepository.js'
import PrismaUserRepository from 'root/repositories/prisma/prismaUserRepository.js'
import PrismaCartRepository from 'root/repositories/prisma/prismaCartRepository.js'
import PrismaAddressRepository from 'root/repositories/prisma/prismaAddressRepository.js'
import PrismaPaymentMethodRepository from 'root/repositories/prisma/prismaPaymentMethodRepository.js'
import 'dotenv/config'

// Factory para crear repositories
// Permite cambiar facilmente entre diferentes implementaciones de prisma

export default class RepositoryFactory {
  /**
   * obtiene un repository de productos
   * @param {string} type - Tipo de repository ("se deja prisma por defecto")
   * @returns {ProductRepository} una instancia de repository de products
   */
  static getProductRepository (type = process.env.DB_PROVIDER) {
    switch (type) {
      case 'mysql':
        return new PrismaProductRepository()
      default:
        throw new Error(`Repository type not supported ${type}`)
    }
  }

  /**
   * obtiene un repository de usuarios
   * @param {string} type - Tipo de repositorio
   * @returns {UserRepository} Una instancia del respository de usuarios
   */
  static getUserRepository (type = process.env.DB_PROVIDER) {
    switch (type) {
      case 'mysql':
        return new PrismaUserRepository()

      default:
        throw new Error(`Repository type not supported ${type}`)
    }
  }

  /**
   * Obtiene un repository de carts
   * @param {string} type
   * @returns {CartRepository}
   */
  static getCartRepository (type = process.env.DB_PROVIDER) {
    switch (type) {
      case 'mysql':
        return new PrismaCartRepository()

      default:
        throw new Error(`Repository type not supported ${type}`)
    }
  }

  /**
   * Se obtiene un respository de addresse
   * @param {string} type
   * @returns {AddressRepository}
   */
  static getAddressRepository (type = process.env.DB_PROVIDER) {
    switch (type) {
      case 'mysql':
        return new PrismaAddressRepository()

      default:
        throw new Error(`Repository type not supported ${type}`)
    }
  }

  /**
   * Se obtiene un repository de paymentMethods
   * @param {string} type
   * @returns {PaymentMethodRespository}
   */
  static getPaymentMethodRepository (type = process.env.DB_PROVIDER) {
    switch (type) {
      case 'mysql':
        return new PrismaPaymentMethodRepository()

      default:
        throw new Error(`Repository type not supported ${type}`)
    }
  }
}
