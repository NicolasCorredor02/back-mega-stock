/* eslint-disable no-unused-vars */
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      default: ' ',
      required: [true, 'Password is required']
    },
    first_name: {
      type: String,
      required: [true, 'Firts name is required'],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required']
    },
    phone: {
      type: String,
      default: ' ',
      required: [true, 'Phone number is required']
    },
    id_number: {
      type: Number,
      unique: true,
      required: [true, 'DNI is required']
    },
    image_profile: {
      type: String,
      trim: true
    },
    addresses: {
      _id: false,
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 5 // Limita a 5 elementos máximo
        },
        message: 'The user cannot have more than 5 addresses'
      },
      type: [
        {
          _id: false,
          address: {
            type: String,
            ref: 'Address'
          },
          is_default: {
            type: Boolean,
            default: false
          }
        }
      ]
    },
    payment_methods: {
      _id: false,
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 5 // Limita a 5 elementos máximo
        },
        message: 'The user cannot have more than 5 paymentMethods'
      },
      type: [
        {
          _id: false,
          payment_method: {
            type: String,
            ref: 'PaymentMethod'
          },
          is_default: {
            type: Boolean,
            default: false
          }
        }
      ]
    },
    security: {
      failed_login_attempts: {
        type: Number,
        default: 0,
        max: 3
      }
    },
    commerce_data: {
      carts: {
        _id: false,
        default: [],
        type: [{
          _id: false,
          cart: {
            type: String,
            ref: 'Cart'
          }
        }]
      },
      total_spent: {
        type: Number,
        default: 0,
        min: 0
      },
      last_order_date: {
        type: String,
        default: ' '
      },
      customer_tier: {
        type: String,
        required: [true, 'Customer tier is required'],
        enum: ['regular', 'vip'],
        default: 'regular'
      }
    },
    status: {
      type: Boolean,
      default: true
    },
    platform: {
      type: String,
      default: 'none',
      enum: ['none', 'google', 'x', 'facebook']
    }
  },
  {
    id: true, // Se establece el id como campo por defecto
    versionKey: false,
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

// Asegurar que monggose use id como identificador por defecto
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id
  }
})

// Middleware para aplicar populates a los datos que se consulten
userSchema.pre('find', function () {
  this.populate({ path: 'addresses.address' }).populate({ path: 'payment_methods.payment_method' }).populate({ path: 'commerce_data.carts.cart' })
})

userSchema.pre('findOne', function () {
  this.populate({ path: 'addresses.address' }).populate({ path: 'payment_methods.payment_method' }).populate({ path: 'commerce_data.carts.cart' })
})

userSchema.pre('findById', function () {
  this.populate({ path: 'addresses.address' }).populate({ path: 'payment_methods.payment_method' }).populate({ path: 'commerce_data.carts.cart' })
})

userSchema.index({ email: 1, id_number: 1 })

// Se agrega el plugin de mongoose paginate aggregate
userSchema.plugin(aggregatePaginate)

export default mongoose.model('User', userSchema)
