import BaseRepository from 'root/repositories/interfaces/baseRepository.js'

export default class UserRepository extends BaseRepository {
  /**
   * Encuentra un usuario por el email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} - el usuario que se encuente o null
   */
  async getByEmail (email) {
    throw new Error('Method not implemented')
  }

  /**
   * Agregar una direccion a un usuario
   * @param {string} userId
   * @param {Object} addressData - datos de la direccion
   * @returns {Promise<Object>} - La direccion creada
   */
  async addAddress (userId, addressData) {
    throw new Error('Method not implemented')
  }

  /**
   * Agregar un metodo de pago a un usuario
   * @param {string} userId
   * @param {Object} paymentData - Datos del metodo de pago
   * @returns {Promise<Object>} - Metodo de pago creado
   */
  async addPaymentMethod (userId, paymentData) {
    throw new Error('Method not implemented')
  }
}
