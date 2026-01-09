const httpStatus = require('http-status');
const { Transaction, User, Course } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a transaction
 * @param {Object} transactionBody
 * @param {ObjectId} adminId - Admin creating the transaction (for manual transactions)
 * @returns {Promise<Transaction>}
 */
const createTransaction = async (transactionBody, adminId) => {
  // Verify user exists
  const user = await User.findById(transactionBody.user_id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // For manual transactions by admin, update wallet balance
  if (adminId && transactionBody.update_wallet !== false) {
    if (transactionBody.type === 'deposit') {
      user.wallet.balance += transactionBody.amount;
    } else if (transactionBody.type === 'withdrawal') {
      if (user.wallet.balance < transactionBody.amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');
      }
      user.wallet.balance -= transactionBody.amount;
    }
    await user.save();
  }

  const transaction = await Transaction.create({
    user_id: transactionBody.user_id,
    type: transactionBody.type,
    amount: transactionBody.amount,
    balance_after: transactionBody.balance_after || user.wallet.balance,
    status: transactionBody.status || 'completed',
    date: transactionBody.date || new Date().toISOString().split('T')[0],
    courseId: transactionBody.courseId || '',
    reference_id: transactionBody.reference_id,
    description: transactionBody.description || '',
  });

  return transaction;
};

/**
 * Create deposit transaction
 * @param {ObjectId} userId - User making the deposit
 * @param {Object} depositData
 * @returns {Promise<Transaction>}
 */
const createDeposit = async (userId, depositData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Update wallet balance
  user.wallet.balance += depositData.amount;
  await user.save();

  const transaction = await Transaction.create({
    user_id: userId,
    type: 'deposit',
    amount: depositData.amount,
    balance_after: user.wallet.balance,
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    description: depositData.description || 'Wallet deposit',
  });

  return transaction;
};

/**
 * Create purchase transaction
 * @param {ObjectId} userId - User making the purchase
 * @param {Object} purchaseData
 * @returns {Promise<Transaction>}
 */
const createPurchase = async (userId, purchaseData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  // Verify course exists and get price
  const course = await Course.findById(purchaseData.course_id);
  if (!course) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course not found');
  }

  const coursePrice = course.pricing.is_free ? 0 : course.pricing.sale_price || course.pricing.price;

  if (user.wallet.balance < coursePrice) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');
  }

  // Deduct from wallet
  user.wallet.balance -= coursePrice;
  await user.save();

  const transaction = await Transaction.create({
    user_id: userId,
    type: 'purchase',
    amount: -coursePrice, // Negative for purchases
    balance_after: user.wallet.balance,
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    courseId: purchaseData.course_id,
    description: `Purchase: ${course.title}`,
  });

  return transaction;
};

/**
 * Create withdrawal transaction
 * @param {ObjectId} userId - User making the withdrawal
 * @param {Object} withdrawalData
 * @returns {Promise<Transaction>}
 */
const createWithdrawal = async (userId, withdrawalData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (user.wallet.balance < withdrawalData.amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient wallet balance');
  }

  // Deduct from wallet
  user.wallet.balance -= withdrawalData.amount;
  await user.save();

  const transaction = await Transaction.create({
    user_id: userId,
    type: 'withdrawal',
    amount: -withdrawalData.amount, // Negative for withdrawals
    balance_after: user.wallet.balance,
    status: 'pending', // Withdrawals might need approval
    date: new Date().toISOString().split('T')[0],
    description: withdrawalData.description || 'Wallet withdrawal',
  });

  return transaction;
};

/**
 * Query for transactions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options, currentUser) => {
  const query = {};

  // Apply role-based filtering
  if (currentUser.role !== 'admin') {
    query.user_id = currentUser._id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }

  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.date_from) {
    query.date = { ...query.date, $gte: filter.date_from };
  }
  if (filter.date_to) {
    query.date = { ...query.date, $lte: filter.date_to };
  }
  if (filter.amount_min !== undefined) {
    query.amount = { ...query.amount, $gte: filter.amount_min };
  }
  if (filter.amount_max !== undefined) {
    query.amount = { ...query.amount, $lte: filter.amount_max };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Transaction.paginate) {
    return Transaction.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [{ path: 'user_id', select: 'name email' }],
    });
  }

  const transactions = await Transaction.find(query)
    .populate('user_id', 'name email')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: transactions };
};

/**
 * Get transaction by id
 * @param {ObjectId} transactionId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Transaction>}
 */
const getTransactionById = async (transactionId, currentUser) => {
  const transaction = await Transaction.findById(transactionId).populate('user_id', 'name email').populate('reference_id'); // Could be Order or other reference

  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  // Check authorization
  if (currentUser.role !== 'admin' && String(transaction.user_id._id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this transaction');
  }

  return transaction;
};

/**
 * Delete transaction by id (Admin only)
 * @param {ObjectId} transactionId
 * @param {ObjectId} adminId - Admin making the request
 * @returns {Promise<Transaction>}
 */
const deleteTransactionById = async (transactionId, adminId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  // Reverse the wallet impact if needed
  if (transaction.status === 'completed') {
    const user = await User.findById(transaction.user_id);
    if (user) {
      // Reverse the transaction effect on wallet
      user.wallet.balance -= transaction.amount;
      await user.save();
    }
  }

  await transaction.deleteOne();
  return transaction;
};

/**
 * Get transactions by user
 * @param {ObjectId} userId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getTransactionsByUser = async (userId, currentUser, options = {}) => {
  // Check authorization
  const isSelf = String(userId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view transactions for this user');
  }

  const filter = { user_id: userId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryTransactions(filter, queryOptions, currentUser);
};

/**
 * Get wallet balance for user
 * @param {ObjectId} userId
 * @returns {Promise<number>}
 */
const getWalletBalance = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user.wallet.balance;
};

/**
 * Process refund
 * @param {ObjectId} transactionId - Original purchase transaction
 * @param {Object} refundData
 * @param {ObjectId} adminId - Admin processing the refund
 * @returns {Promise<Transaction>}
 */
const processRefund = async (transactionId, refundData, adminId) => {
  const originalTransaction = await Transaction.findById(transactionId);
  if (!originalTransaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (originalTransaction.type !== 'purchase') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only refund purchase transactions');
  }

  // Create refund transaction (positive amount to add back to wallet)
  const refundAmount = Math.abs(originalTransaction.amount); // Convert negative to positive

  const user = await User.findById(originalTransaction.user_id);
  if (user) {
    user.wallet.balance += refundAmount;
    await user.save();
  }

  const refundTransaction = await Transaction.create({
    user_id: originalTransaction.user_id,
    type: 'refund',
    amount: refundAmount,
    balance_after: user ? user.wallet.balance : 0,
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    courseId: originalTransaction.courseId,
    reference_id: originalTransaction._id,
    description: refundData.description || `Refund for transaction ${originalTransaction._id}`,
  });

  return refundTransaction;
};

/**
 * Get transaction statistics
 * @returns {Promise<Object>}
 */
const getTransactionStats = async () => {
  const totalTransactions = await Transaction.countDocuments();

  const transactionsByType = await Transaction.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } },
  ]);

  const transactionsByStatus = await Transaction.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  const totalVolume = await Transaction.aggregate([
    {
      $match: {
        type: { $in: ['deposit', 'purchase', 'refund'] },
        status: 'completed',
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const transactionsByMonth = await Transaction.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  return {
    totalTransactions,
    transactionsByType,
    transactionsByStatus,
    totalVolume: totalVolume[0]?.total || 0,
    transactionsByMonth,
  };
};

/**
 * Get transaction summary
 * @param {Object} currentUser - User requesting the summary
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const getTransactionSummary = async (currentUser, options = {}) => {
  const userId = currentUser.role === 'admin' ? options.user_id : currentUser._id;

  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User ID required for summary');
  }

  const matchStage = { user_id: userId };

  if (options.date_from || options.date_to) {
    matchStage.date = {};
    if (options.date_from) matchStage.date.$gte = options.date_from;
    if (options.date_to) matchStage.date.$lte = options.date_to;
  }

  const summary = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        deposits: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$type', 'deposit'] }, { $eq: ['$status', 'completed'] }] }, '$amount', 0],
          },
        },
        purchases: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$type', 'purchase'] }, { $eq: ['$status', 'completed'] }] }, '$amount', 0],
          },
        },
        withdrawals: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$type', 'withdrawal'] }, { $eq: ['$status', 'completed'] }] }, '$amount', 0],
          },
        },
        refunds: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$type', 'refund'] }, { $eq: ['$status', 'completed'] }] }, '$amount', 0],
          },
        },
      },
    },
  ]);

  const user = await User.findById(userId);
  const currentBalance = user ? user.wallet.balance : 0;

  return {
    user_id: userId,
    current_balance: currentBalance,
    summary: summary[0] || {
      totalTransactions: 0,
      deposits: 0,
      purchases: 0,
      withdrawals: 0,
      refunds: 0,
    },
  };
};

module.exports = {
  createTransaction,
  createDeposit,
  createPurchase,
  createWithdrawal,
  queryTransactions,
  getTransactionById,
  deleteTransactionById,
  getTransactionsByUser,
  getWalletBalance,
  processRefund,
  getTransactionStats,
  getTransactionSummary,
};
