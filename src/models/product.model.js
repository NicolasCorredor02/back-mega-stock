import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: 100
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 500
    },
    code: {
      type: String,
      required: true,
      unique: true,
      match: [/^[A-Z]{3}-[A-Z0-9]{4}$/, 'Invalid code format'] // Ej: TEC-AP01
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, 'Price must be at least 0.01']
    },
    stock: {
      type: Number,
      required: true,
      min: [1, 'Stock must be at least 1']
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ['technology', "women's clothing", "men's clothing", 'footwear'],
        message: 'Invalid category'
      },
      index: true
    },
    thumbnails: {
      type: [String],
      default: []
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  })

productSchema.index({ title: 'text', description: 'text', code: 'text', category: 1, status: 1 })

export default mongoose.model('Product', productSchema)
