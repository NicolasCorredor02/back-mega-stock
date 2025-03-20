import mongoose from 'mongoose'

const payMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: ['card', 'paypal', 'transfer']
    },
    provider: {
      type: String,
      required: [true, "Payment's provider is required"],
      trim: true
    },
    card_number: {
      type: String,
      trim: true,
      required: function () {
        return this.type === 'card'
      },
      select: false // Hace que no se incluya en las consultas por defecto
    },
    last_four: {
      type: String,
      trim: true,
      match: [/^\d{4}$/, 'It must be the last 4 digits of the card']
    },
    expiry_date: {
      type: String,
      trim: true,
      match: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'The date format must be MM/YY']
    },
    is_saved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Se agrega automaticamente el create_at y updated_at
  }
)

export default mongoose.model('PayMethod', payMethodSchema)
