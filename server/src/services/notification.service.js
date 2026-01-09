const httpStatus = require('http-status');
const { Notification, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a notification
 * @param {ObjectId} senderId - User creating the notification (admin/instructor)
 * @param {Object} notificationBody
 * @returns {Promise<Notification>}
 */
const createNotification = async (senderId, notificationBody) => {
  // Verify recipient exists
  const recipient = await User.findById(notificationBody.recipient_id);
  if (!recipient) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Recipient not found');
  }

  const notification = await Notification.create({
    recipient_id: notificationBody.recipient_id,
    content: notificationBody.content,
    type: notificationBody.type || 'system',
    is_read: notificationBody.is_read || false,
  });

  return notification;
};

/**
 * Query for notifications
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryNotifications = async (filter, options, currentUser) => {
  const query = {};

  // Apply role-based filtering
  if (currentUser.role !== 'admin') {
    query.recipient_id = currentUser._id;
  } else if (filter.recipient_id) {
    query.recipient_id = filter.recipient_id;
  }

  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.is_read !== undefined) {
    query.is_read = filter.is_read;
  }
  if (filter.date_from) {
    query.created_at = { ...query.created_at, $gte: new Date(filter.date_from) };
  }
  if (filter.date_to) {
    query.created_at = { ...query.created_at, $lte: new Date(filter.date_to) };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 20;
  const page = options.page || 1;

  if (Notification.paginate) {
    return Notification.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [{ path: 'recipient_id', select: 'name email' }],
    });
  }

  const notifications = await Notification.find(query)
    .populate('recipient_id', 'name email')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: notifications };
};

/**
 * Get notification by id
 * @param {ObjectId} notificationId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Notification>}
 */
const getNotificationById = async (notificationId, currentUser) => {
  const notification = await Notification.findById(notificationId).populate('recipient_id', 'name email');

  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  // Check authorization
  if (currentUser.role !== 'admin' && String(notification.recipient_id._id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this notification');
  }

  return notification;
};

/**
 * Update notification by id
 * @param {ObjectId} notificationId
 * @param {Object} updateBody
 * @param {Object} currentUser - User making the update
 * @returns {Promise<Notification>}
 */
const updateNotificationById = async (notificationId, updateBody, currentUser) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  // Check authorization - only recipient can update (mainly for marking as read)
  if (String(notification.recipient_id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this notification');
  }

  // Only allow updating is_read status
  if (updateBody.is_read !== undefined) {
    notification.is_read = updateBody.is_read;
    await notification.save();
  }

  return notification;
};

/**
 * Delete notification by id
 * @param {ObjectId} notificationId
 * @param {Object} currentUser - User making the delete request
 * @returns {Promise<Notification>}
 */
const deleteNotificationById = async (notificationId, currentUser) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  // Check authorization
  if (currentUser.role !== 'admin' && String(notification.recipient_id) !== String(currentUser._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this notification');
  }

  await notification.deleteOne();
  return notification;
};

/**
 * Get notifications by recipient
 * @param {ObjectId} recipientId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getNotificationsByRecipient = async (recipientId, currentUser, options = {}) => {
  // Check authorization
  const isSelf = String(recipientId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view notifications for this recipient');
  }

  const filter = { recipient_id: recipientId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryNotifications(filter, queryOptions, currentUser);
};

/**
 * Mark notification as read
 * @param {ObjectId} notificationId
 * @param {ObjectId} userId - User marking as read
 * @returns {Promise<Notification>}
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  // Check authorization
  if (String(notification.recipient_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to mark this notification as read');
  }

  notification.is_read = true;
  await notification.save();

  return notification;
};

/**
 * Mark all notifications as read for user
 * @param {ObjectId} userId - User marking notifications as read
 * @returns {Promise<Object>}
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany({ recipient_id: userId, is_read: false }, { is_read: true });

  return {
    success: true,
    message: 'All notifications marked as read',
    modifiedCount: result.modifiedCount,
  };
};

/**
 * Send bulk notifications
 * @param {Object} bulkData - { recipient_ids, content, type }
 * @param {ObjectId} senderId - Admin sending the notifications
 * @returns {Promise<Object>}
 */
const sendBulkNotifications = async (bulkData, senderId) => {
  const { recipient_ids, content, type } = bulkData;

  // Verify all recipients exist
  const recipients = await User.find({ _id: { $in: recipient_ids } });
  if (recipients.length !== recipient_ids.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'One or more recipients not found');
  }

  // Create notifications
  const notifications = recipient_ids.map((recipientId) => ({
    recipient_id: recipientId,
    content,
    type: type || 'system',
    is_read: false,
  }));

  const createdNotifications = await Notification.insertMany(notifications);

  return {
    success: true,
    message: `Notifications sent to ${createdNotifications.length} recipients`,
    count: createdNotifications.length,
    notifications: createdNotifications,
  };
};

/**
 * Delete all notifications for a recipient
 * @param {ObjectId} recipientId - Recipient whose notifications to delete
 * @returns {Promise<Object>}
 */
const deleteNotificationsByRecipient = async (recipientId) => {
  const result = await Notification.deleteMany({ recipient_id: recipientId });

  return {
    success: true,
    message: 'All notifications deleted',
    deletedCount: result.deletedCount,
  };
};

/**
 * Get notification statistics
 * @returns {Promise<Object>}
 */
const getNotificationStats = async () => {
  const totalNotifications = await Notification.countDocuments();

  const notificationsByType = await Notification.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);

  const readVsUnread = await Notification.aggregate([{ $group: { _id: '$is_read', count: { $sum: 1 } } }]);

  const notificationsByRecipient = await Notification.aggregate([
    {
      $group: {
        _id: '$recipient_id',
        count: { $sum: 1 },
        unreadCount: { $sum: { $cond: [{ $eq: ['$is_read', false] }, 1, 0] } },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const notificationsByMonth = await Notification.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  return {
    totalNotifications,
    notificationsByType,
    readVsUnread,
    notificationsByRecipient,
    notificationsByMonth,
  };
};

module.exports = {
  createNotification,
  queryNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
  getNotificationsByRecipient,
  markAsRead,
  markAllAsRead,
  sendBulkNotifications,
  deleteNotificationsByRecipient,
  getNotificationStats,
};
