const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  body: Joi.object().keys({
    recipient_id: Joi.string().required().custom(objectId),
    content: Joi.string().required(),
    type: Joi.string().valid('system', 'promotion', 'reminder').default('system'),
    is_read: Joi.boolean(),
  }),
};

const getNotifications = {
  query: Joi.object().keys({
    recipient_id: Joi.string().custom(objectId), // admin filter
    is_read: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      is_read: Joi.boolean(),
    })
    .min(1),
};

const deleteNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
};


