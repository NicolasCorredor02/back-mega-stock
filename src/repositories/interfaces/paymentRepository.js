import BaseRepository from 'root/repositories/interfaces/baseRepository.js'

export default class PaymentRepository extends BaseRepository {
  /**
   * Encuentra métodos de pago por usuario
   * @param {string} userId
   * @returns {Promise<Array>} - Lista de metodos de pago
   */
  async getByUserId (userId) {
    throw new Error('Method not implemented')
  }
}
