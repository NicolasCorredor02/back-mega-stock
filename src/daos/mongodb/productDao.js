import MongoDao from 'root/daos/mongodb/mongoDao.js'
import Product from 'root/daos/mongodb/models/product.model.js'

class ProductDao extends MongoDao {
  constructor (model) {
    super(model)
    this.model = model
  }

  codeExist = async (obj) => {
    try {
      return await this.model.findOne(obj)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export const productDao = new ProductDao(Product)
