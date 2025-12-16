const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createMessage = {
  body: Joi.object().keys({
    classroom_id: Joi.string().required().custom(objectId),
    content: Joi.string().required(),
    type: Joi.string().valid('text', 'system').default('text'),
  }),
};

const getMessages = {
  query: Joi.object().keys({
    classroom_id: Joi.string().custom(objectId).required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};


