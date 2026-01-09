const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const TRANSACTION_TYPES = ['deposit', 'purchase', 'refund', 'withdrawal'];
const TRANSACTION_STATUSES = ['completed', 'pending', 'failed'];

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
    status: {
      type: String,
      enum: TRANSACTION_STATUSES,
      default: 'completed',
    },
    date: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      trim: true,
      default: '',
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
  TRANSACTION_STATUSES,
};
