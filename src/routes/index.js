import { Router } from 'express'
import products from 'root/routes/product.route.js'
import carts from 'root/routes/cart.route.js'
import admin from 'root/routes/admin.routes.js'
import user from 'root/routes/user.route.js'

const router = Router()

/**
 * Get de Home Page
 */
router.get('/', (req, res, next) => {
  try {
    return res.render('productsClient')
  } catch (error) {
    next(error)
  }
})

/**
 * Get para rutas no existentes
 */
// TODO: Revisar la ruta para not founded ya que no me esta sirviendo
// router.get('*', (req, res) => {
//   res.json({ message: 'Rute not founded' })
// })

router.use('/api/products', products)
router.use('/api/cart', carts)
router.use('/api/user', user)
router.use('/api/admin', admin)

export default router
