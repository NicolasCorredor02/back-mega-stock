import { prisma } from '../../../prisma/config.js'

import BaseRepository from 'root/repositories/interfaces/baseRepository.js'
// import ProductRepository from 'root/repositories/interfaces/productRepository.js'
// import UserRepository from 'root/repositories/interfaces/userRepository.js'
// import CartRespository from 'root/repositories/interfaces/cartRepository.js'
// import AddressRepository from 'root/repositories/interfaces/addressRepository.js'
// import PaymentRepository from 'root/repositories/interfaces/paymentRepository.js'

export default class PrismaBaseRepository extends BaseRepository {
  constructor (model) {
    super()
    this.model = model
  }

  async create (data) {
    return prisma[this.model].create({
      data
    })
  }

  async getById (id) {
    return prisma[this.model].findUnique({
      where: { id }
    })
  }

  async getAll (filter = {}, options = {}) {
    const { skip, take, orderBy } = options

    return prisma[this.model].findMany({
      where: filter,
      skip: skip || undefined,
      take: take || undefined,
      orderBy: orderBy || undefined
    })
  }

  async getOne (criteria) {
    return prisma[this.model].findFirst({
      where: criteria
    })
  }

  async update (id, data) {
    return prisma[this.model].update({
      where: { id },
      data
    })
  }

  async delete (id) {
    await prisma[this.model].delete({
      where: { id }
    })

    return true
  }
}
