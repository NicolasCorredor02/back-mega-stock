/* eslint-disable no-unused-vars */
import mongoose from 'mongoose'
import Cart from 'root/models/cart.model.js'
import Address from 'root/models/address.model.js'
import PaymentMethod from 'root/models/paymentMethod.model.js'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    first_name: {
      type: String,
      required: [true, 'Firts name is required'],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    id_number: {
      type: Number,
      unique: true,
      required: [true, 'DNI is required']
    },
    addresses: [
      {
        address: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Address'
        },
        is_default: {
          type: Boolean,
          default: false
        }
      }
    ],
    payment_methods: [
      {
        payment_method: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PaymentMethod'
        },
        is_default: {
          type: Boolean,
          default: false
        }
      }
    ],
    security: {
      failed_login_attempts: {
        type: Number,
        default: 0,
        max: 3
      }
    },
    commerce_data: {
      carts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
      }],
      total_spent: {
        type: Number,
        default: 0,
        min: 0.1
      },
      last_order_date: {
        type: String
      },
      customer_tier: {
        type: String,
        required: [true, 'Customer tier is required'],
        enum: ['regular', 'vip'],
        default: 'regular'
      }
    }
  },
  {
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

// Middleware para aplicar populates a los datos que se consulten
userSchema.pre('find', function () {
  this.populate({ path: 'addresses.address' }).populate({ path: 'payment_methods.payment_method' }).populate({ path: 'commerce_data.carts' })
})

userSchema.pre('findOne', function () {
  this.populate({ path: 'addresses.address' }).populate({ path: 'payment_methods.payment_method' }).populate({ path: 'commerce_data.carts' })
})

userSchema.pre('findById', function () {
  this.populate({ path: 'addresses.address' }).populate({ path: 'payment_methods.payment_method' }).populate({ path: 'commerce_data.carts' })
})

userSchema.index({ email: 1, id_number: 1 })

export default mongoose.model('User', userSchema)
