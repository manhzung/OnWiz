const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const NOTIFICATION_TYPES = ['system', 'promotion', 'reminder'];

const notificationSchema = new mongoose.Schema(
  {
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: 'system',
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {
  Notification,
  NOTIFICATION_TYPES,
};
