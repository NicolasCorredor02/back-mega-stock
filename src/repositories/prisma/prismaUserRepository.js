import { prisma } from '../../../prisma/config.js'
import PrismaBaseRepository from 'root/repositories/prisma/prismaBaseRepository.js'
import 'dotenv/config'
import CustomError from 'root/utils/customError.js'

export default class PrismaUserRepository extends PrismaBaseRepository {
  constructor () {
    super('user')
  }

  async getByEmail (email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          addresses: true,
          payment_methods: true,
          carts: true
        }
      })
      return user
    } catch (error) {
      console.error('Error geting user', error)
      throw new CustomError('Error geting user', 500)
    }
  }

  async addAddress (userId, addressData) {
    return prisma.address.create({
      data: {
        ...addressData,
        is_saved: true,
        user: {
          connect: { id: userId }
        }
      }
    })
  }

  async addPaymentMethod (userId, paymentData) {
    return prisma.paymentMethod.create({
      data: {
        ...paymentData,
        is_saved: true,
        user: {
          connect: { id: userId }
        }
      }
    })
  }

  async getById (id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        payment_methods: true,
        carts: true
      }
    })
  }

  loginAdmin (email, password) {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return { id: 'admin-id' }
    }
    return false
  }
}
