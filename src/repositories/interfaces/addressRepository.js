import BaseRepository from 'root/repositories/interfaces/baseRepository.js'

export default class AddressRepository extends BaseRepository {
  /**
   * Encuentra las direcciones por usuario
   * @param {string} userId
   * @returns {Promise<Array>} - Lista de direcciones
   */
  async getByUserId (userId) {
    throw new Error('Method not implemented')
  }
}
