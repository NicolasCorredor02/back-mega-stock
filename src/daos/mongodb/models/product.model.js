import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true
    },
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
    id: true,
    versionKey: false,
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  })

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})

productSchema.index({ title: 'text', description: 'text', code: 'text', category: 1, status: 1 })

// Se agrega el plugin de mongoose paginate aggregate
productSchema.plugin(aggregatePaginate)

export default mongoose.model('Product', productSchema)
