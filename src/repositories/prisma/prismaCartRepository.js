import { prisma } from '../../../prisma/config.js'
import PrismaBaseRepository from 'root/repositories/prisma/prismaBaseRepository.js'

export default class PrismaCartRepository extends PrismaBaseRepository {
  constructor () {
    super('cart')
  }

  async getByUserId (userId) {
    return prisma.cart.findMany({
      where: { userId },
      include: {
        products: {
          include: {
            product: true
          }
        },
        address: true,
        paymentMethod: true
      }
    })
  }
}
