const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const MESSAGE_TYPES = ['text', 'system'];

const messageSchema = new mongoose.Schema(
  {
    classroom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: MESSAGE_TYPES,
      default: 'text',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const Message = mongoose.model('Message', messageSchema);

module.exports = {
  Message,
  MESSAGE_TYPES,
};
