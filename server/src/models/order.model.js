const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ORDER_STATUSES = ['pending', 'completed', 'failed', 'cancelled'];
const PAYMENT_METHODS = ['wallet', 'card', 'bank_transfer', 'other'];

const orderItemSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    total_amount: {
      type: Number,
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    payment_method: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    accessExpiresAt: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Order,
  ORDER_STATUSES,
  PAYMENT_METHODS,
};
