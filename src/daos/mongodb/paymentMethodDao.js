/* eslint-disable no-useless-constructor */
import MongoDao from 'root/daos/mongodb/mongoDao.js'
import PaymentMethod from 'root/daos/mongodb/models/paymentMethod.model.js'

class PaymentMethodDao extends MongoDao {
  constructor (model) {
    super(model)
  }
}

export const paymentMethodDao = new PaymentMethodDao(PaymentMethod)
