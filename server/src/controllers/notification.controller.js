const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

/**
 * Create a notification
 * @route POST /api/v1/notifications
 * @access Private (Admin/Instructor)
 */
const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(notification);
});

/**
 * Query notifications
 * @route GET /api/v1/notifications
 * @access Private (Users see their own, Admin sees all)
 */
const getNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.queryNotifications(
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
 * Get notification by ID
 * @route GET /api/v1/notifications/:notificationId
 * @access Private (Recipient or Admin)
 */
const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId, req.user);
  res.send(notification);
});

/**
 * Update notification by ID
 * @route PATCH /api/v1/notifications/:notificationId
 * @access Private (Recipient only - for marking as read)
 */
const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotificationById(req.params.notificationId, req.body, req.user);
  res.send(notification);
});

/**
 * Delete notification by ID
 * @route DELETE /api/v1/notifications/:notificationId
 * @access Private (Recipient or Admin)
 */
const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.notificationId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get notifications by recipient
 * @route GET /api/v1/notifications/recipient/:recipientId
 * @access Private (Recipient themselves or Admin)
 */
const getNotificationsByRecipient = catchAsync(async (req, res) => {
  const result = await notificationService.getNotificationsByRecipient(req.params.recipientId, req.user, req.query);
  res.send(result);
});

/**
 * Get my notifications
 * @route GET /api/v1/notifications/my-notifications
 * @access Private (Users)
 */
const getMyNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.getNotificationsByRecipient(req.user._id, req.user, req.query);
  res.send(result);
});

/**
 * Mark notification as read
 * @route PATCH /api/v1/notifications/:notificationId/read
 * @access Private (Recipient only)
 */
const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.notificationId, req.user._id);
  res.send(notification);
});

/**
 * Mark all notifications as read
 * @route PATCH /api/v1/notifications/mark-all-read
 * @access Private (Users)
 */
const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  res.send(result);
});

/**
 * Send bulk notifications
 * @route POST /api/v1/notifications/bulk
 * @access Private (Admin)
 */
const sendBulkNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.sendBulkNotifications(req.body, req.user._id);
  res.status(httpStatus.CREATED).send(result);
});

/**
 * Get notification statistics
 * @route GET /api/v1/notifications/stats
 * @access Private (Admin)
 */
const getNotificationStats = catchAsync(async (req, res) => {
  const stats = await notificationService.getNotificationStats();
  res.send(stats);
});

/**
 * Delete all notifications for user
 * @route DELETE /api/v1/notifications/my-notifications
 * @access Private (Users)
 */
const deleteMyNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.deleteNotificationsByRecipient(req.user._id);
  res.send(result);
});

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByRecipient,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  sendBulkNotifications,
  getNotificationStats,
  deleteMyNotifications,
};
