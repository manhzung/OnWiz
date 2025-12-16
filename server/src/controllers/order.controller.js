const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
  const result = await orderService.queryOrders(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId, req.user);
  res.send(order);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);
  res.send(order);
});

const deleteOrder = catchAsync(async (req, res) => {
  await orderService.deleteOrderById(req.params.orderId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};


