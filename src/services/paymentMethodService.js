/* eslint-disable no-useless-catch */
import RepositoryFactory from 'root/repositories/factory.js'
import CustomError from 'root/utils/customError.js'

class PaymentMethodService {
  constructor () {
    this.paymentMethodRepository = RepositoryFactory.getPaymentMethodRepository()
  }

  async create (data) {
    try {
      if (!data) throw new CustomError('PaymentMethod details are required', 404)

      const paymentMethodData = {
        ...data,
        is_saved: data.is_saved || false
      }

      const response = await this.paymentMethodRepository.create(paymentMethodData)

      if (!response) throw new CustomError('PaymentMethod not created', 404)
      return response
    } catch (error) {
      throw error
    }
  }

  async getAll (filter = {}, options = {}) {
    try {
      return await this.paymentMethodRepository.getAll(filter, options)
    } catch (error) {
      throw new CustomError('Error findind data', 500)
    }
  }

  async getById (id) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.paymentMethodRepository.getById(id)
      if (!response) throw new CustomError('PaymentMethod not found', 404)
      return response
    } catch (error) {
      throw error
    }
  }

  async update (id, data) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)
      if (data.id) throw new CustomError('Error, product ID can not be updated')

      const currentPaymentMethod = await this.getById(id)
      if (!currentPaymentMethod) throw new CustomError('PaymentMethod not founded', 404)

      const response = await this.paymentMethodRepository.update(id, data)
      if (!response) throw new CustomError('PaymentMethod not founded', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  async delete (id) {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.paymentMethodRepository.delete(id)
      if (!response) throw new CustomError('PaymentMethod not deleted', 404)

      return response
    } catch (error) {
      throw error
    }
  }
}

export const paymentMethodService = new PaymentMethodService()
