/* eslint-disable no-useless-constructor */
import MongoDao from 'root/daos/mongodb/mongoDao.js'
import Cart from 'root/daos/mongodb/models/cart.model.js'

class CartDao extends MongoDao {
  constructor (model) {
    super(model)
  }
}

export const cartDao = new CartDao(Cart)
