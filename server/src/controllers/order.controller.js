const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

/**
 * Create an order
 * @route POST /api/v1/orders
 * @access Private (Users)
 */
const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(order);
});

/**
 * Query orders
 * @route GET /api/v1/orders
 * @access Private (Users see their own, Admin sees all)
 */
const getOrders = catchAsync(async (req, res) => {
  const result = await orderService.queryOrders(
    req.query,
    {
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      page: req.query.page,
    },
    req.user
  );
  res.send(result);
});

/**
 * Get order by ID
 * @route GET /api/v1/orders/:orderId
 * @access Private (Owner or Admin)
 */
const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId, req.user);
  res.send(order);
});

/**
 * Update order by ID
 * @route PATCH /api/v1/orders/:orderId
 * @access Private (Admin only)
 */
const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body, req.user);
  res.send(order);
});

/**
 * Delete order by ID
 * @route DELETE /api/v1/orders/:orderId
 * @access Private (Admin only)
 */
const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get orders by user
 * @route GET /api/v1/orders/user/:userId
 * @access Private (Owner or Admin)
 */
const getOrdersByUser = catchAsync(async (req, res) => {
  const result = await orderService.getOrdersByUser(req.params.userId, req.user, req.query);
  res.send(result);
});

/**
 * Get my orders
 * @route GET /api/v1/orders/my-orders
 * @access Private (Users)
 */
const getMyOrders = catchAsync(async (req, res) => {
  const result = await orderService.getOrdersByUser(req.user._id, req.user, req.query);
  res.send(result);
});

/**
 * Process order payment
 * @route POST /api/v1/orders/:orderId/process-payment
 * @access Private (Admin)
 */
const processPayment = catchAsync(async (req, res) => {
  const order = await orderService.processPayment(req.params.orderId, req.body, req.user._id);
  res.send(order);
});

/**
 * Cancel order
 * @route PATCH /api/v1/orders/:orderId/cancel
 * @access Private (Owner or Admin)
 */
const cancelOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.orderId, req.user);
  res.send(order);
});

/**
 * Get order statistics
 * @route GET /api/v1/orders/stats
 * @access Private (Admin)
 */
const getOrderStats = catchAsync(async (req, res) => {
  const stats = await orderService.getOrderStats();
  res.send(stats);
});

/**
 * Get order by code
 * @route GET /api/v1/orders/code/:code
 * @access Private (Owner or Admin)
 */
const getOrderByCode = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByCode(req.params.code, req.user);
  res.send(order);
});

/**
 * Refund order
 * @route POST /api/v1/orders/:orderId/refund
 * @access Private (Admin)
 */
const refundOrder = catchAsync(async (req, res) => {
  const result = await orderService.refundOrder(req.params.orderId, req.body, req.user._id);
  res.send(result);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
  getMyOrders,
  processPayment,
  cancelOrder,
  getOrderStats,
  getOrderByCode,
  refundOrder,
};
