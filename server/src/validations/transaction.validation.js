const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  body: Joi.object().keys({
    user_id: Joi.string().required().custom(objectId),
    type: Joi.string().valid('deposit', 'payment', 'refund').required(),
    amount: Joi.number().required(),
    balance_after: Joi.number().required(),
    reference_id: Joi.string().custom(objectId),
    description: Joi.string().allow(''),
  }),
};

const getTransactions = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId),
    type: Joi.string().valid('deposit', 'payment', 'refund'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
};

const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  deleteTransaction,
};


