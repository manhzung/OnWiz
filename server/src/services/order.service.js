const httpStatus = require('http-status');
const { Order, Course, Enrollment } = require('../models');
const ApiError = require('../utils/ApiError');
const { transactionService } = require('./transaction.service');

/**
 * Generate unique order code
 * @returns {string}
 */
const generateOrderCode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

/**
 * Create an order
 * @param {ObjectId} userId - User creating the order
 * @param {Object} orderBody
 * @returns {Promise<Order>}
 */
const createOrder = async (userId, orderBody) => {
  // Validate courses exist and calculate total
  let calculatedTotal = 0;
  const validatedItems = [];

  for (const item of orderBody.items) {
    const course = await Course.findById(item.course_id);
    if (!course) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Course ${item.course_id} not found`);
    }

    if (!course.is_published) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Course ${course.title} is not published`);
    }

    const coursePrice = course.pricing.is_free ? 0 : course.pricing.sale_price || course.pricing.price;
    calculatedTotal += coursePrice;

    validatedItems.push({
      course_id: item.course_id,
      price: coursePrice,
    });
  }

  // Override client total with calculated total for security
  const orderData = {
    code: orderBody.code || generateOrderCode(),
    user_id: userId,
    status: 'pending',
    total_amount: calculatedTotal,
    items: validatedItems,
    payment_method: orderBody.payment_method,
  };

  const order = await Order.create(orderData);
  return order;
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options, currentUser) => {
  const query = {};

  // Apply role-based filtering
  if (currentUser.role !== 'admin') {
    query.user_id = currentUser._id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }

  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.payment_method) {
    query.payment_method = filter.payment_method;
  }
  if (filter.code) {
    query.code = { $regex: filter.code, $options: 'i' };
  }
  if (filter.date_from) {
    query.created_at = { ...query.created_at, $gte: new Date(filter.date_from) };
  }
  if (filter.date_to) {
    query.created_at = { ...query.created_at, $lte: new Date(filter.date_to) };
  }
  if (filter.amount_min !== undefined) {
    query.total_amount = { ...query.total_amount, $gte: filter.amount_min };
  }
  if (filter.amount_max !== undefined) {
    query.total_amount = { ...query.total_amount, $lte: filter.amount_max };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Order.paginate) {
    return Order.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'user_id', select: 'name email' },
        {
          path: 'items.course_id',
          select: 'title slug thumbnail_url pricing',
        },
      ],
    });
  }

  const orders = await Order.find(query)
    .populate('user_id', 'name email')
    .populate('items.course_id', 'title slug thumbnail_url pricing')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: orders };
};

/**
 * Get order by id
 * @param {ObjectId} orderId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Order>}
 */
const getOrderById = async (orderId, currentUser) => {
  const order = await Order.findById(orderId)
    .populate('user_id', 'name email')
    .populate('items.course_id', 'title slug thumbnail_url pricing instructor');

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check authorization
  if (currentUser.role !== 'admin' && String(order.user_id._id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this order');
  }

  return order;
};

/**
 * Get order by code
 * @param {string} code - Order code
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Order>}
 */
const getOrderByCode = async (code, currentUser) => {
  const order = await Order.findOne({ code })
    .populate('user_id', 'name email')
    .populate('items.course_id', 'title slug thumbnail_url pricing instructor');

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check authorization
  if (currentUser.role !== 'admin' && String(order.user_id._id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this order');
  }

  return order;
};

/**
 * Update order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 * @param {Object} currentUser - User making the update
 * @returns {Promise<Order>}
 */
const updateOrderById = async (orderId, updateBody, currentUser) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check authorization (only admin can update orders)
  if (currentUser.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update orders');
  }

  Object.assign(order, updateBody);
  await order.save();
  return order;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @param {Object} currentUser - User making the delete request
 * @returns {Promise<Order>}
 */
const deleteOrderById = async (orderId, currentUser) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check authorization (only admin can delete orders)
  if (currentUser.role !== 'admin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete orders');
  }

  // Only allow deletion of pending orders
  if (order.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete orders that are not pending');
  }

  await order.deleteOne();
  return order;
};

/**
 * Get orders by user
 * @param {ObjectId} userId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getOrdersByUser = async (userId, currentUser, options = {}) => {
  // Check authorization
  const isSelf = String(userId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view orders for this user');
  }

  const filter = { user_id: userId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryOrders(filter, queryOptions, currentUser);
};

/**
 * Process order payment
 * @param {ObjectId} orderId
 * @param {Object} paymentData
 * @param {ObjectId} adminId - Admin processing the payment
 * @returns {Promise<Order>}
 */
const processPayment = async (orderId, paymentData, adminId) => {
  const order = await Order.findById(orderId).populate('user_id', 'name email wallet').populate('items.course_id');

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Order is not in pending status');
  }

  // Update order status
  order.status = paymentData.success ? 'completed' : 'failed';
  await order.save();

  if (paymentData.success) {
    // Create enrollments for each course in the order
    for (const item of order.items) {
      // Check if user is already enrolled
      const existingEnrollment = await Enrollment.findOne({
        user_id: order.user_id._id,
        course_id: item.course_id._id,
      });

      if (!existingEnrollment) {
        await Enrollment.create({
          user_id: order.user_id._id,
          course_id: item.course_id._id,
          status: 'active',
        });
      }
    }

    // Create transaction record
    await transactionService.createTransaction(
      {
        user_id: order.user_id._id,
        type: 'purchase',
        amount: -order.total_amount, // Negative for purchases
        balance_after: order.user_id.wallet.balance - order.total_amount,
        status: 'completed',
        courseId: order.items.length === 1 ? order.items[0].course_id._id : null,
        reference_id: order._id,
        description: `Purchase via order ${order.code}`,
      },
      false
    ); // Don't update wallet again
  }

  return order;
};

/**
 * Cancel order
 * @param {ObjectId} orderId
 * @param {Object} currentUser - User canceling the order
 * @returns {Promise<Order>}
 */
const cancelOrder = async (orderId, currentUser) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check authorization
  const isOwner = String(order.user_id) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to cancel this order');
  }

  // Only allow cancellation of pending orders
  if (order.status !== 'pending') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot cancel orders that are not pending');
  }

  order.status = 'cancelled';
  await order.save();

  return order;
};

/**
 * Refund order
 * @param {ObjectId} orderId
 * @param {Object} refundData
 * @param {ObjectId} adminId - Admin processing the refund
 * @returns {Promise<Object>}
 */
const refundOrder = async (orderId, refundData, adminId) => {
  const order = await Order.findById(orderId).populate('user_id', 'name email wallet').populate('items.course_id');

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (order.status !== 'completed') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only refund completed orders');
  }

  const refundAmount = refundData.amount || order.total_amount;

  // Create refund transaction
  const refundTransaction = await transactionService.createTransaction(
    {
      user_id: order.user_id._id,
      type: 'refund',
      amount: refundAmount,
      balance_after: order.user_id.wallet.balance + refundAmount,
      status: 'completed',
      courseId: order.items.length === 1 ? order.items[0].course_id._id : null,
      reference_id: order._id,
      description: refundData.description || `Refund for order ${order.code}`,
    },
    false
  ); // Don't update wallet again

  // Update user wallet
  order.user_id.wallet.balance += refundAmount;
  await order.user_id.save();

  // Optionally remove enrollments
  if (refundData.remove_enrollments) {
    for (const item of order.items) {
      await Enrollment.findOneAndDelete({
        user_id: order.user_id._id,
        course_id: item.course_id._id,
      });
    }
  }

  return {
    order,
    refund_transaction: refundTransaction,
    refund_amount: refundAmount,
  };
};

/**
 * Get order statistics
 * @returns {Promise<Object>}
 */
const getOrderStats = async () => {
  const totalOrders = await Order.countDocuments();

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$total_amount' } } },
  ]);

  const ordersByPaymentMethod = await Order.aggregate([
    { $group: { _id: '$payment_method', count: { $sum: 1 }, totalAmount: { $sum: '$total_amount' } } },
  ]);

  const totalRevenue = await Order.aggregate([
    {
      $match: { status: 'completed' },
    },
    { $group: { _id: null, total: { $sum: '$total_amount' } } },
  ]);

  const ordersByMonth = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$total_amount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  return {
    totalOrders,
    ordersByStatus,
    ordersByPaymentMethod,
    totalRevenue: totalRevenue[0]?.total || 0,
    ordersByMonth,
  };
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  getOrderByCode,
  updateOrderById,
  deleteOrderById,
  getOrdersByUser,
  processPayment,
  cancelOrder,
  refundOrder,
  getOrderStats,
};
