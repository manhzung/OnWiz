const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTransaction = {
  body: Joi.object().keys({
    user_id: Joi.string().required().custom(objectId),
    type: Joi.string().valid('deposit', 'purchase', 'refund', 'withdrawal').required(),
    amount: Joi.number().required(),
    balance_after: Joi.number(),
    status: Joi.string().valid('pending', 'completed', 'failed'),
    date: Joi.string(),
    courseId: Joi.string(),
    reference_id: Joi.string().custom(objectId),
    description: Joi.string().allow(''),
    update_wallet: Joi.boolean(),
  }),
};

const createDeposit = {
  body: Joi.object().keys({
    amount: Joi.number().min(0.01).required(),
    description: Joi.string().allow(''),
  }),
};

const createPurchase = {
  body: Joi.object().keys({
    course_id: Joi.string().custom(objectId).required(),
  }),
};

const createWithdrawal = {
  body: Joi.object().keys({
    amount: Joi.number().min(0.01).required(),
    description: Joi.string().allow(''),
  }),
};

const getTransactions = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId),
    type: Joi.string().valid('deposit', 'purchase', 'refund', 'withdrawal'),
    status: Joi.string().valid('pending', 'completed', 'failed'),
    date_from: Joi.string(),
    date_to: Joi.string(),
    amount_min: Joi.number(),
    amount_max: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

const deleteTransaction = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
};

const getTransactionsByUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const processRefund = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    amount: Joi.number().min(0.01),
    description: Joi.string().allow(''),
  }),
};

const getTransactionSummary = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId),
    date_from: Joi.string(),
    date_to: Joi.string(),
  }),
};

module.exports = {
  createTransaction,
  createDeposit,
  createPurchase,
  createWithdrawal,
  getTransactions,
  getTransaction,
  deleteTransaction,
  getTransactionsByUser,
  processRefund,
  getTransactionSummary,
};
