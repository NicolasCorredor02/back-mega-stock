import MongoDao from 'root/daos/mongodb/mongoDao.js'
import User from 'root/daos/mongodb/models/user.model.js'
import dotenv from 'dotenv'

class UserDao extends MongoDao {
  constructor (model) {
    super(model)
    this.model = model
  }

  login = async (email, password) => {
    try {
      return await this.model.findOne({ email, password })
    } catch (error) {
      throw new Error(error)
    }
  }

  loginAdmin = (email, password) => {
    dotenv.config()
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return true
    }
    return false
  }
}

export const userDao = new UserDao(User)
