import MongoDao from 'root/daos/mongodb/mongoDao.js'
import Address from 'root/daos/mongodb/models/address.model.js'

class AddressDao extends MongoDao {
    constructor (model) {
        super(model)
    }
}

export const addressDao = new AddressDao(Address)
