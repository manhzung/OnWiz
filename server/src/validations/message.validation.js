const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
  body: Joi.object().keys({
    classroom_id: Joi.string().required().custom(objectId),
    content: Joi.string().required().trim().min(1).max(1000),
    type: Joi.string().valid('text', 'system').default('text'),
  }),
};

const getMessages = {
  query: Joi.object().keys({
    classroom_id: Joi.string().custom(objectId),
    type: Joi.string().valid('text', 'system'),
    sender_id: Joi.string().custom(objectId),
    date_from: Joi.string(),
    date_to: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const updateMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    content: Joi.string().required().trim().min(1).max(1000),
  }),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const getMessagesByClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMessagesBySender = {
  params: Joi.object().keys({
    senderId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchMessages = {
  query: Joi.object().keys({
    q: Joi.string().min(1).max(100),
    classroom_id: Joi.string().custom(objectId),
    type: Joi.string().valid('text', 'system'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const markMessagesAsRead = {
  body: Joi.object().keys({
    messageIds: Joi.array().items(Joi.string().custom(objectId)).min(1).required(),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessagesByClassroom,
  getMessagesBySender,
  searchMessages,
  markMessagesAsRead,
};
