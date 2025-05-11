import { prisma } from '../../../prisma/config.js'
import PrismaBaseRepository from 'root/repositories/prisma/prismaBaseRepository.js'

export default class PrismaCartRepository extends PrismaBaseRepository {
  constructor () {
    super('cart')
  }

  async createCart (cartData) {
    // Si el carrito incluye productos, crear el carrito y los items
    const { products, ...cartDetails } = cartData

    try {
    // Transacción para crear carrito y sus productos relacionados
      const result = await prisma.$transaction(async (tx) => {
      // Crear el carrito primero
        const cart = await tx.cart.create({
          data: cartDetails
        })

        // Si hay productos, crear los cartItems
        if (products && Array.isArray(products) && products.length > 0) {
          const cartItems = products.map((item) => ({
            cartId: cart.id,
            productId: item.product,
            quantity: item.quantity
          }))

          // Usar el nombre correcto de la tabla según el esquema Prisma
          await tx.productsOnCarts.createMany({
            data: cartItems
          })
        }

        // Retornar el carrito con sus productos
        const cartWithProducts = await tx.cart.findUnique({
          where: { id: cart.id },
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
        return cartWithProducts
      })
      return result
    } catch (error) {
      console.error('Error creating cart:', error)
      throw error
    }
  }

  async getByIdWithProducts (id) {
    return await prisma.cart.findUnique({
      where: { id },
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

  async getAllWithProducts () {
    return await prisma.cart.findMany({
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
