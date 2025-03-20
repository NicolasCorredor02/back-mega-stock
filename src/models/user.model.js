import mongoose from 'mongoose'

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
    shopping_carts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingCart'
      }
    ]
  },
  {
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

userSchema.index({ email: 1, id_number: 1 })

export default mongoose.model('User', userSchema)
