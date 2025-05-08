import { prisma } from '../../../prisma/config.js'
import PrismaBaseRepository from 'root/repositories/prisma/prismaBaseRepository.js'

export default class PrismaAddressRespository extends PrismaBaseRepository {
  constructor () {
    super('address')
  }

  async getByUserId (userId) {
    return prisma.address.findMany({
      where: { userId }
    })
  }
}
