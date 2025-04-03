/* eslint-disable no-unused-vars */
import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

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
      required: [true, 'Phone number is required'],
      trim: true
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
            type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
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
            type: mongoose.Schema.Types.ObjectId,
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
    }
  },
  {
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

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
