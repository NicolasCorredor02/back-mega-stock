import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Se suben dos niveles: /src/utils → /src
const rootPath = resolve(__dirname, '..')

// Path de imagenes para productos
const pathImagesProducts = 'MegaStock/uploads/products'

// Path de imagenes para usuarios
const pathImagesUsers = 'MegaStock/uploads/users'

// Path de url para imagenes default de productos
const productUrlImageDefault = 'https://res.cloudinary.com/dz6rq4bae/image/upload/v1740781423/default-product_j5jikm.webp'

// Path de url para imagenes default de usuarios
const userUrlImageDefault = 'https://res.cloudinary.com/dz6rq4bae/image/upload/v1740781419/default-user_dhx4rw.webp'

export { rootPath, pathImagesProducts, pathImagesUsers, productUrlImageDefault, userUrlImageDefault }
