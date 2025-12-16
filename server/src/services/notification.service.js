const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotification = async (body) => {
  const notif = await Notification.create({
    recipient_id: body.recipient_id,
    content: body.content,
    type: body.type || 'system',
    is_read: body.is_read ?? false,
  });
  return notif;
};

const queryNotifications = async (filter, options, currentUser) => {
  const query = {};

  if (currentUser.role !== 'admin') {
    query.recipient_id = currentUser.id;
  } else if (filter.recipient_id) {
    query.recipient_id = filter.recipient_id;
  }
  if (filter.is_read !== undefined) {
    query.is_read = filter.is_read;
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 20;
  const page = options.page || 1;

  if (Notification.paginate) {
    return Notification.paginate(query, { sortBy: sort, limit, page });
  }
  const notifs = await Notification.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: notifs };
};

const updateNotificationById = async (notificationId, body, currentUser) => {
  const notif = await Notification.findById(notificationId);
  if (!notif) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  if (currentUser.role !== 'admin' && String(notif.recipient_id) !== String(currentUser.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  if (body.is_read !== undefined) {
    notif.is_read = body.is_read;
  }
  await notif.save();
  return notif;
};

const deleteNotificationById = async (notificationId, currentUser) => {
  const notif = await Notification.findById(notificationId);
  if (!notif) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  if (currentUser.role !== 'admin' && String(notif.recipient_id) !== String(currentUser.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await notif.deleteOne();
  return notif;
};

module.exports = {
  createNotification,
  queryNotifications,
  updateNotificationById,
  deleteNotificationById,
};


