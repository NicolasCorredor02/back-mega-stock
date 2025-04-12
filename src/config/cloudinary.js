import { v2 as cloudinary } from 'cloudinary'
import 'dotenv/config'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const deleteCloudinaryImages = async (folder, images) => {
  if (!folder || !images || images.length === 0) return

  console.log('Intentando eliminar imágenes de Cloudinary:', images)

  const deletePromises = images.map(async (imageUrl) => {
    // Extraccion del id publico de la url en Cloudinary
    const publicId = imageUrl.split('/MegaStock/')[1].split('.')[0]
    console.log('Public ID a eliminar:', publicId)

    try {
      const result = await cloudinary.uploader.destroy(`MegaStock/${publicId}`)
      console.log('Resultado de eliminación:', result)
    } catch (error) {
      console.error(`Error deleting Cloudinary image: ${imageUrl}`, error)
      return null
    }
  })

  await Promise.all(deletePromises)
}

const deleteCloudinaryImage = async (folder, image) => {
  if (!folder || !image) return

  console.log('Intentando eliminar imágen de Cloudinary:', image)

  const publicId = image.split('/MegaStock/')[1].split('.')[0]
  console.log('Public ID a eliminar:', publicId)

  try {
    const result = await cloudinary.uploader.destroy(`MegaStock/${publicId}`)
    console.log('Resultado de eliminación:', result)
  } catch (error) {
    console.error(`Error deleting Cloudinary image: ${image}`, error)
    return null
  }
}

export { cloudinary, deleteCloudinaryImages, deleteCloudinaryImage }
