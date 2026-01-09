const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  body: Joi.object().keys({
    recipient_id: Joi.string().required().custom(objectId),
    content: Joi.string().required().trim().min(1).max(500),
    type: Joi.string().valid('system', 'promotion', 'reminder').default('system'),
    is_read: Joi.boolean().default(false),
  }),
};

const getNotifications = {
  query: Joi.object().keys({
    recipient_id: Joi.string().custom(objectId), // admin filter
    type: Joi.string().valid('system', 'promotion', 'reminder'),
    is_read: Joi.boolean(),
    date_from: Joi.string(),
    date_to: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const updateNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      is_read: Joi.boolean(),
    })
    .min(1),
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const getNotificationsByRecipient = {
  params: Joi.object().keys({
    recipientId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const markAsRead = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const sendBulkNotifications = {
  body: Joi.object().keys({
    recipient_ids: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
    content: Joi.string().required().trim().min(1).max(500),
    type: Joi.string().valid('system', 'promotion', 'reminder').default('system'),
  }),
};

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByRecipient,
  markAsRead,
  sendBulkNotifications,
};
