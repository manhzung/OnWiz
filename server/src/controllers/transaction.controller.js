const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const transactionService = require('../services/transaction.service');

const createTransaction = catchAsync(async (req, res) => {
  const tx = await transactionService.createTransaction(req.body);
  res.status(httpStatus.CREATED).send(tx);
});

const getTransactions = catchAsync(async (req, res) => {
  const result = await transactionService.queryTransactions(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

const getTransaction = catchAsync(async (req, res) => {
  const tx = await transactionService.getTransactionById(req.params.transactionId, req.user);
  res.send(tx);
});

const deleteTransaction = catchAsync(async (req, res) => {
  await transactionService.deleteTransactionById(req.params.transactionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  deleteTransaction,
};


