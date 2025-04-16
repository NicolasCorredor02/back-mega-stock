/* eslint-disable no-useless-catch */
import CustomError from 'root/utils/customError.js'
import { addressDao } from 'root/daos/mongodb/addressDao.js'

class AddressService {
  constructor (dao) {
    this.dao = dao
  }

  create = async (data) => {
    try {
      if (!data) throw new CustomError('Address details are required', 404)

      const addressData = {
        ...data,
        is_saved: data.is_saved || false
      }

      const response = await this.dao.create(addressData)

      if (!response) throw new CustomError('Address not created', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  getAll = async (reqQuerys) => {
    try {
      const pipeline = []

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

      if (!response) throw new CustomError('Address not found', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  update = async (id, data) => {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)
      if (data._id) throw new CustomError('Error, product ID can not be updated')

      const currentAddress = await this.dao.getById(id)
      if (!currentAddress) throw new CustomError('Address not founded', 404)

      const response = await this.dao.update(id, data)
      if (!response) throw new CustomError('Address not updated', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  delete = async (id) => {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.delete(id)
      if (!response) throw new CustomError('Address not deleted', 404)

      return response
    } catch (error) {
      throw error
    }
  }
}

export const addressService = new AddressService(addressDao)
