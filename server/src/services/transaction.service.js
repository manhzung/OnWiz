const httpStatus = require('http-status');
const { Transaction } = require('../models');
const ApiError = require('../utils/ApiError');

const createTransaction = async (body) => {
  const tx = await Transaction.create({
    user_id: body.user_id,
    type: body.type,
    amount: body.amount,
    balance_after: body.balance_after,
    reference_id: body.reference_id,
    description: body.description || '',
  });
  return tx;
};

const queryTransactions = async (filter, options, currentUser) => {
  const query = {};

  if (currentUser.role !== 'admin') {
    query.user_id = currentUser.id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }

  if (filter.type) {
    query.type = filter.type;
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Transaction.paginate) {
    return Transaction.paginate(query, { sortBy: sort, limit, page });
  }

  const txs = await Transaction.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: txs };
};

const getTransactionById = async (transactionId, currentUser) => {
  const tx = await Transaction.findById(transactionId);
  if (!tx) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  if (currentUser.role !== 'admin' && String(tx.user_id) !== String(currentUser.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return tx;
};

const deleteTransactionById = async (transactionId) => {
  const tx = await Transaction.findById(transactionId);
  if (!tx) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  await tx.deleteOne();
  return tx;
};

module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  deleteTransactionById,
};


