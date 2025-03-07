/* eslint-disable camelcase */
/* eslint-disable no-useless-catch */
import fs from 'fs/promises'
import path from 'path'
import { rootPath } from 'root/utils/paths'

const ruteDB = path.resolve(rootPath, 'db', 'users.json')

export class UsersManager {
  //* Arrays de datos requeridos para la creacion de datos del usuario

  static requiredToCreateUser = [
    'first_name',
    'last_name',
    'id_number',
    'email',
    'phone',
    'birth_date',
    'gender',
    'password_hash',
    'policy_consent'
  ]

  static requieredToAddAddress = ['street', 'city', 'state', 'country']

  /**
   *
   * @returns {array} array with products
   */
  static async readDB () {
    const data = await fs.readFile(ruteDB, 'utf-8')
    if (!data) return []
    return JSON.parse(data)
  }

  /**
   *
   * @param {array} products
   * @returns {boolean}
   */
  static async writeDB (products) {
    try {
      if (!products) {
        return false
      }

      await fs.writeFile(ruteDB, JSON.stringify(products, null, 2))

      return true
    } catch (error) {
      throw new Error('Error when saving or updating product(s)')
    }
  }

  // * ------------ CONSULTAS PARA UN ROL DE ADMINISTRADOR -------------------

  /**
   *
   * @returns {array} // Array with users
   */
  static async getUsers () {
    try {
      const allUsers = await this.readDB()

      if (!allUsers) {
        throw new Error('No users found')
      }

      return allUsers
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @param {*} id
   * @returns
   */
  static async getUserById (id) {
    try {
      const allUsers = await this.readDB()

      if (!allUsers) {
        throw new Error('No users found')
      }

      const user = allUsers.find((u) => u.id === parseInt(id))

      if (!user) {
        throw new Error(`Error: User with id ${id} not found`)
      }

      return user
    } catch (error) {}
  }

  /**
   *
   * @param {object} user
   * @returns {object} // User obj
   */
  static async createUser (user) {
    try {
      const allUsers = await this.readDB()

      if (!allUsers) {
        throw new Error('No users found')
      }

      for (const requiredField of this.requiredToCreateUser) {
        if (!(requiredField in user)) {
          throw new Error(`The ${requiredField} is required`)
        }
      }

      // Destructuring del user para generar el nuevo usuario
      const {
        first_name,
        last_name,
        id_number,
        email,
        img_profile,
        phone,
        birth_date,
        gender,
        password_hash,
        policy_consent,
        marketing_consent
      } = user

      const newUser = {
        id: allUsers.length + 1,
        personal_info: {
          first_name,
          last_name,
          id_number,
          email,
          img_profile,
          phone,
          birth_date,
          gender
        },
        account: {
          password_hash,
          crate_at: new Date(),
          status: true,
          policy_consent,
          marketing_consent
        },
        addresses: [],
        payment_methods: [],
        security: {
          failed_login_attempts: 0
        },
        commerce_data: {
          carts: [],
          total_spent: 0,
          last_order_date: '',
          customer_tier: 'regular'
        }
      }

      allUsers.push(newUser)

      const resultAddUser = await this.writeDB(allUsers)

      if (!resultAddUser) {
        throw new Error('Error, an error occurred while registering the user')
      }

      return newUser
    } catch (error) {
      throw error
    }
  }

  static async addAddress (idUser, objAddress) {
    try {
      let currentUser = await this.getUserById(idUser)

      if (!currentUser) {
        throw new Error('The user is not in the database')
      }

      for (const requiredField of this.requieredToAddAddress) {
        if (!(requiredField in objAddress)) {
          throw new Error(`The ${requiredField} is required`)
        }
      }

      // Recuperacion de las direcciones actuales del usuario
      const currentAddresses = currentUser.addresses

      // Destructuring del objAddress
      const { street, city, state, country } = objAddress

      // array newAddress para ser insertado en el usuario
      const newAddress = {
        id: currentAddresses.length + 1,
        type: 'send',
        street,
        city,
        state,
        postal_code: objAddress.postal_code ? objAddress.postal_code : '',
        country
      }

      // Push de la nueva direccion
      currentAddresses.push(newAddress)

      // Acualizaicon del usuario
      currentUser = {
        ...currentUser,
        addresses: currentAddresses
      }

      // TODO Seguir logica teniendo en cuenta Mongoose y mongo para facilidad
    } catch (error) {
      throw error
    }
  }
}
