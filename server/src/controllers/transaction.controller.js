const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');

/**
 * Create a transaction
 * @route POST /api/v1/transactions
 * @access Private (Admin for manual transactions)
 */
const createTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.body, req.user._id);
  res.status(httpStatus.CREATED).send(transaction);
});

/**
 * Query transactions
 * @route GET /api/v1/transactions
 * @access Private (Users see their own, Admin sees all)
 */
const getTransactions = catchAsync(async (req, res) => {
  const result = await transactionService.queryTransactions(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

/**
 * Get transaction by ID
 * @route GET /api/v1/transactions/:transactionId
 * @access Private (Owner or Admin)
 */
const getTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.transactionId, req.user);
  res.send(transaction);
});

/**
 * Delete transaction by ID (Admin only)
 * @route DELETE /api/v1/transactions/:transactionId
 * @access Private (Admin only)
 */
const deleteTransaction = catchAsync(async (req, res) => {
  await transactionService.deleteTransactionById(req.params.transactionId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get transactions by user
 * @route GET /api/v1/transactions/user/:userId
 * @access Private (Owner or Admin)
 */
const getTransactionsByUser = catchAsync(async (req, res) => {
  const result = await transactionService.getTransactionsByUser(req.params.userId, req.user, req.query);
  res.send(result);
});

/**
 * Get my transactions
 * @route GET /api/v1/transactions/my-transactions
 * @access Private (Users)
 */
const getMyTransactions = catchAsync(async (req, res) => {
  const result = await transactionService.getTransactionsByUser(req.user._id, req.user, req.query);
  res.send(result);
});

/**
 * Create deposit transaction
 * @route POST /api/v1/transactions/deposit
 * @access Private (Users)
 */
const createDeposit = catchAsync(async (req, res) => {
  const transaction = await transactionService.createDeposit(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(transaction);
});

/**
 * Create purchase transaction
 * @route POST /api/v1/transactions/purchase
 * @access Private (Users)
 */
const createPurchase = catchAsync(async (req, res) => {
  const transaction = await transactionService.createPurchase(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(transaction);
});

/**
 * Create withdrawal transaction
 * @route POST /api/v1/transactions/withdrawal
 * @access Private (Users)
 */
const createWithdrawal = catchAsync(async (req, res) => {
  const transaction = await transactionService.createWithdrawal(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(transaction);
});

/**
 * Get transaction statistics
 * @route GET /api/v1/transactions/stats
 * @access Private (Admin)
 */
const getTransactionStats = catchAsync(async (req, res) => {
  const stats = await transactionService.getTransactionStats();
  res.send(stats);
});

/**
 * Get user wallet balance
 * @route GET /api/v1/transactions/balance
 * @access Private (Users)
 */
const getWalletBalance = catchAsync(async (req, res) => {
  const balance = await transactionService.getWalletBalance(req.user._id);
  res.send({ balance });
});

/**
 * Process refund
 * @route POST /api/v1/transactions/:transactionId/refund
 * @access Private (Admin)
 */
const processRefund = catchAsync(async (req, res) => {
  const transaction = await transactionService.processRefund(req.params.transactionId, req.body, req.user._id);
  res.send(transaction);
});

/**
 * Get transaction summary
 * @route GET /api/v1/transactions/summary
 * @access Private (Users see their own, Admin sees global)
 */
const getTransactionSummary = catchAsync(async (req, res) => {
  const summary = await transactionService.getTransactionSummary(req.user, req.query);
  res.send(summary);
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  deleteTransaction,
  getTransactionsByUser,
  getMyTransactions,
  createDeposit,
  createPurchase,
  createWithdrawal,
  getTransactionStats,
  getWalletBalance,
  processRefund,
  getTransactionSummary,
};
