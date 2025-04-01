import CustomError from 'root/utils/customError.js'
import mongoose from 'mongoose'

export default class MongoDao {
  constructor (model) {
    this.model = model
  }

  create = async (data) => {
    try {
      return await this.model.create(data)
    } catch (error) {
      throw new Error(error)
    }
  }

  getAll = async (pipeline, paginateParams) => {
    try {
      const dataPipeline = this.model.aggregate(pipeline)
      return await this.model.aggregatePaginate(dataPipeline, paginateParams)
    } catch (error) {
      throw new Error(error)
    }
  }

  getById = async (id) => {
    try {
      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(id)) throw new CustomError('Invalid ID format', 400)

      return await this.model.findById(id)
    } catch (error) {
      throw error
    }
  }

  update = async (id, data) => {
    try {
      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(id)) throw new CustomError('Invalid ID format', 400)

      return await this.model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
    } catch (error) {
      throw new Error(error)
    }
  }

  delete = async (id) => {
    try {
      // Validación del ID
      if (!mongoose.Types.ObjectId.isValid(id)) throw new CustomError('Invalid ID format', 400)

      return await this.model.findByIdAndDelete(id)
    } catch (error) {
      throw new Error(error)
    }
  }
}
