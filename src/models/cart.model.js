import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      required: [true, 'User type required'],
      enum: {
        values: ['registered', 'guest']
      }
    },
    user_info: {
      firts_name: String,
      last_name: String,
      email: String,
      phone: String,
      id_number: Number,
      required: [true, 'User infor is required']
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: [true, 'Address is required']
    },
    payment_method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      requiered: [true, 'Status is required'],
      enum: ['active', 'completed', 'abandoned', 'cancelled'],
      default: 'active'
    },
    products: [
      {
        prodcut: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          requiered: [true, 'Product reference is required']
        },
        quantity: {
          type: Number,
          min: [1, 'Quantity must be at least 1'],
          required: [true, "Product's quantity is required"]
        }
      }
    ],
    sub_total: {
      type: Number,
      required: [true, "Cart's sub total is required"]
    }
  },
  {
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

export default mongoose.model('Cart', cartSchema)
