/* eslint-disable no-useless-catch */
import RepositoryFactory from 'root/repositories/factory.js'
import CustomError from 'root/utils/customError.js'

class AddressService {
  constructor () {
    this.addressRepository = RepositoryFactory.getAddressRepository()
  }

  async create (data) {
    try {
      if (!data) throw new CustomError('Address details are required', 404)

      const addressData = {
        ...data,
        is_saved: data.is_saved || false
      }

      const response = await this.addressRepository.create(addressData)

      if (!response) throw new CustomError('Address not created', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  async getAll (filter = {}, options = {}) {
    try {
      return await this.addressRepository.getAll(filter, options)
    } catch (error) {
      throw new CustomError('Error findinf data', 500)
    }
  }

  async getById (id) {
    try {
      if (!id || id.trim() === '') throw new CustomError('Id is required', 404)

      const response = await this.addressRepository.getById(id)

      if (!response) throw new CustomError('Address not found', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  async update (id, data) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)
      if (data.id) throw new CustomError('Error, product ID can not be updated')

      const currentAddress = await this.getById(id)
      if (!currentAddress) throw new CustomError('Address not founded', 404)

      const response = await this.addressRepository.update(id, data)
      if (!response) throw new CustomError('Address not updated', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  async delete (id) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.addressRepository.delete(id)
      if (!response) throw new CustomError('Address not deleted', 404)

      return response
    } catch (error) {
      throw error
    }
  }
}

export const addressService = new AddressService()
