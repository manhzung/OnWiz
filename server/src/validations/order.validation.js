const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          course_id: Joi.string().required().custom(objectId),
          price: Joi.number().min(0).required(),
        })
      )
      .min(1)
      .required(),
    total_amount: Joi.number().min(0).required(),
    payment_method: Joi.string().valid('wallet', 'card', 'bank_transfer', 'other').required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // admin có thể filter theo user
    status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled'),
      payment_method: Joi.string().valid('wallet', 'card', 'bank_transfer', 'other'),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};


