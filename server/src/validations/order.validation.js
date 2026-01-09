const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    code: Joi.string().optional(),
    items: Joi.array()
      .items(
        Joi.object().keys({
          course_id: Joi.string().required().custom(objectId),
          price: Joi.number().min(0), // Price will be calculated server-side
        })
      )
      .min(1)
      .required(),
    payment_method: Joi.string().valid('wallet', 'card', 'bank_transfer', 'other').required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // admin filter
    status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled'),
    payment_method: Joi.string().valid('wallet', 'card', 'bank_transfer', 'other'),
    code: Joi.string(),
    date_from: Joi.string(),
    date_to: Joi.string(),
    amount_min: Joi.number().min(0),
    amount_max: Joi.number().min(0),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
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
    orderId: Joi.string().custom(objectId),
  }),
};

const getOrdersByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrderByCode = {
  params: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

const processPayment = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    success: Joi.boolean().required(),
    transaction_id: Joi.string(),
    payment_details: Joi.object(),
  }),
};

const cancelOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const refundOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    amount: Joi.number().min(0.01),
    description: Joi.string().required(),
    remove_enrollments: Joi.boolean().default(false),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
  getOrderByCode,
  processPayment,
  cancelOrder,
  refundOrder,
};
