import PrismaBaseRepository from 'root/repositories/prisma/prismaBaseRepository.js'
import { prisma } from '../../../prisma/config.js'

export default class PrismaProductRepository extends PrismaBaseRepository {
  constructor () {
    super('product')
  }

  async getByCategory (category) {
    return prisma.product.findMany({
      where: { category }
    })
  }
}
