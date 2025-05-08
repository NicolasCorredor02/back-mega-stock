import BaseRepository from 'root/repositories/interfaces/baseRepository.js'

export default class CartRepository extends BaseRepository {
  /**
   * Encuentra los carritos por usuario
   * @param {string} userId
   * @returns {Promise<Array>} - Lista de carritos
   */
  async getByUserId (userId) {
    throw new Error('Method not implemented')
  }
}
