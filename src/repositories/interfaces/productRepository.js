import BaseRepository from 'root/repositories/interfaces/baseRepository.js'

export default class ProductsRespository extends BaseRepository {
  /**
   * Encuentra productos por categoria
   * @param {string} category
   * @returns {Promise<Array>} - Lista de productos
   */
  async getByCategory (category) {
    throw new Error('Method not implemented')
  }
}
