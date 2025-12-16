const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrder = async (userId, body) => {
  // Ở đây tạm tin tưởng total_amount gửi từ client, sau này có thể tính lại từ items
  const order = await Order.create({
    code: body.code,
    user_id: userId,
    status: 'pending',
    total_amount: body.total_amount,
    items: body.items,
    payment_method: body.payment_method,
  });
  return order;
};

const queryOrders = async (filter, options, currentUser) => {
  const query = {};

  // Nếu không phải admin, chỉ được xem đơn của chính mình
  if (currentUser.role !== 'admin') {
    query.user_id = currentUser.id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }

  if (filter.status) {
    query.status = filter.status;
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Order.paginate) {
    return Order.paginate(query, { sortBy: sort, limit, page });
  }

  const orders = await Order.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: orders };
};

const getOrderById = async (orderId, currentUser) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (currentUser.role !== 'admin' && String(order.user_id) !== String(currentUser.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return order;
};

const updateOrderById = async (orderId, updateBody) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (updateBody.status !== undefined) {
    order.status = updateBody.status;
  }
  if (updateBody.payment_method !== undefined) {
    order.payment_method = updateBody.payment_method;
  }
  await order.save();
  return order;
};

const deleteOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.deleteOne();
  return order;
};

module.exports = {
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};


