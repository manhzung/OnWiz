const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const notificationService = require('../services/notification.service');

const createNotification = catchAsync(async (req, res) => {
  const notif = await notificationService.createNotification(req.body);
  res.status(httpStatus.CREATED).send(notif);
});

const getNotifications = catchAsync(async (req, res) => {
  const result = await notificationService.queryNotifications(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

const updateNotification = catchAsync(async (req, res) => {
  const notif = await notificationService.updateNotificationById(req.params.notificationId, req.body, req.user);
  res.send(notif);
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.notificationId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotification,
  getNotifications,
  updateNotification,
  deleteNotification,
};


