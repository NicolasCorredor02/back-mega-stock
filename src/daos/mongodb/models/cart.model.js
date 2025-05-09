/* eslint-disable no-unused-vars */
import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { v4 as uuidv4 } from 'uuid'

const cartSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true
    },
    user_type: {
      type: String,
      required: [true, 'User type required'],
      enum: {
        values: ['registered', 'guest']
      }
    },
    user_info: {
      first_name: {
        type: String,
        trim: true,
        required: [true, 'First name is required']
      },
      last_name: {
        type: String,
        trim: true,
        required: [true, 'Last name is required']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        trim: true,
        required: [true, 'A phone number is required']
      },
      id_number: {
        type: Number,
        required: [true, 'DNI is required']
      }
    },
    address: {
      type: String,
      ref: 'Address',
      required: [true, 'Address is required']
    },
    payment_method: {
      type: String,
      ref: 'PaymentMethod',
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      requiered: [true, 'Status is required'],
      enum: ['active', 'completed', 'abandoned', 'cancelled'],
      default: 'active'
    },
    products: {
      _id: false,
      type: [{
        _id: false,
        product: {
          type: String,
          ref: 'Product',
          requiered: [true, 'Product reference is required']
        },
        quantity: {
          type: Number,
          min: [1, 'Quantity must be at least 1'],
          required: [true, "Product's quantity is required"]
        }
      }]
    },
    sub_total: {
      type: Number,
      required: [true, "Cart's sub total is required"]
    }
  },
  {
    id: true,
    versionKey: false,
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

cartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})

// Middleware para aplicar populates a los datos que se consulten
cartSchema.pre('find', function () {
  this.populate('address').populate('payment_method').populate({ path: 'products.product' })
})

cartSchema.pre('findOne', function () {
  this.populate('address').populate('payment_method').populate({ path: 'products.product' })
})

cartSchema.pre('findById', function () {
  this.populate('address').populate('payment_method').populate({ path: 'products.product' })
})

// Se agrega el plugin de mongoose paginate aggregate
cartSchema.plugin(aggregatePaginate)

export default mongoose.model('Cart', cartSchema)
