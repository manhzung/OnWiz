const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const TRANSACTION_TYPES = ['deposit', 'payment', 'refund'];

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balance_after: {
      type: Number,
      required: true,
    },
    reference_id: {
      type: mongoose.Schema.Types.ObjectId,
      // có thể liên kết tới Order hoặc entity khác
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
  Transaction,
  TRANSACTION_TYPES,
};


