import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const addressSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true
    },
    street: {
      type: String,
      required: [true, 'street is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'state is required'],
      trim: true
    },
    postal_code: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    is_saved: {
      type: Boolean,
      default: false
    }
  },
  {
    id: true,
    versionKey: false,
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

addressSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})

// Se agrega el plugin de mongoose paginate aggregate
addressSchema.plugin(aggregatePaginate)

export default mongoose.model('Address', addressSchema)
