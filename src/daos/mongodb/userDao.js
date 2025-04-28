import MongoDao from 'root/daos/mongodb/mongoDao.js'
import User from 'root/daos/mongodb/models/user.model.js'
import 'dotenv/config'

class UserDao extends MongoDao {
  constructor (model) {
    super(model)
    this.model = model
  }

  getByEmail = async (email) => {
    try {
      return await this.model.findOne({ email })
    } catch (error) {
      throw new Error(error)
    }
  }

  loginAdmin = (email, password) => {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return ({ id: 'admin-id' })
    }
    return false
  }
}

export const userDao = new UserDao(User)
