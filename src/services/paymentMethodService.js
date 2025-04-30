/* eslint-disable no-useless-catch */
import CustomError from 'root/utils/customError.js'
import { paymentMethodDao } from 'root/daos/mongodb/paymentMethodDao.js'

class PaymentMethodService {
  constructor (dao) {
    this.dao = dao
  }

  create = async (data) => {
    try {
      if (!data) throw new CustomError('PaymentMethod details are required', 404)

      const paymentMethodData = {
        ...data,
        is_saved: data.is_saved || false
      }

      const response = await this.dao.create(paymentMethodData)

      if (!response) throw new CustomError('PaymentMethod not created', 404)
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
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.getById(id)
      if (!response) throw new CustomError('PaymentMethod not found', 404)
      return response
    } catch (error) {
      throw error
    }
  }

  update = async (id, data) => {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)
      if (data.id) throw new CustomError('Error, product ID can not be updated')

      const currentPaymentMethod = await this.dao.getById(id)
      if (!currentPaymentMethod) throw new CustomError('PaymentMethod not founded', 404)

      const response = await this.dao.update(id, data)
      if (!response) throw new CustomError('PaymentMethod not founded', 404)

      return response
    } catch (error) {
      throw error
    }
  }

  delete = async (id) => {
    try {
      if (!id || id.trim === '') throw new CustomError('Id is required', 404)

      const response = await this.dao.delete(id)
      if (!response) throw new CustomError('PaymentMethod not deleted', 404)

      return response
    } catch (error) {
      throw error
    }
  }
}

export const paymentMethodService = new PaymentMethodService(paymentMethodDao)
