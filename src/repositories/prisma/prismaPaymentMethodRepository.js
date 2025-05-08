import { prisma } from '../../../prisma/config.js'
import PrismaBaseRepository from 'root/repositories/prisma/prismaBaseRepository.js'

export default class PrismaPaymentMethodRepository extends PrismaBaseRepository {
  constructor () {
    super('paymentMethod')
  }

  async getByUserId (userId) {
    return prisma.paymentMethod.findMany({
      where: { userId }
    })
  }

  async getByType (type) {
    return prisma.paymentMethod.findMany({
      where: { type }
    })
  }
}
