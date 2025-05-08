/**
 * Interfaz base para todos los repositorios
 */

export default class BaseRepository {
  /**
   * Creacion de un nuevo registro en la DB
   * @param {Object} data
   * @returns {Promise<Object>} El registro creado en la DB
   */
  async create (data) {
    throw new Error('Method not implemented')
  }

  /**
   * Encuentra un registro por el ID
   * @param {string} id
   * @returns {Promise<Object>} Registro encontrado o null
   */
  async getById (id) {
    throw new Error('Method not implemented')
  }

  /**
   * Encuentra todos los registros
   * @param {Object} filter - filtros opcionales
   * @param {Object} options - Opciones de paginacion y ordenamiento
   * @returns {Promise<Array>} - Lista de registros de la DB
   */
  async getAll (filter = {}, options = {}) {
    throw new Error('Method not implemented')
  }

  /**
   * Actualiza la info de un registro de la DB
   * @param {string} id - id del registro a actualizar
   * @param {Object} data - datos a actualizar
   * @returns {Promise<Object>} - Registro actualizado
   */
  async update (id, data) {
    throw new Error('Method not implemented')
  }

  /**
   * Elimina un registro de la Db
   * @param {string} id - id del registro a eliminar
   * @returns {Promise<Boolena>}
   */
  async delete (id) {
    throw new Error('Method not implemented')
  }
}
