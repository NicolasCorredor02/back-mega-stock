import MongoDao from 'root/daos/mongodb/mongoDao.js'
import User from 'root/daos/mongodb/models/user.model.js'

class UserDao extends MongoDao {
    constructor (model) {
        super(model)
    }
}

export const userDao = new UserDao(User)
