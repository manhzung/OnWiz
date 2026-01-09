const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');

/**
 * Create a message
 * @route POST /api/v1/messages
 * @access Private (Classroom members)
 */
const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(message);
});

/**
 * Query messages
 * @route GET /api/v1/messages
 * @access Private (Classroom members)
 */
const getMessages = catchAsync(async (req, res) => {
  const result = await messageService.queryMessages(
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
 * Get message by ID
 * @route GET /api/v1/messages/:messageId
 * @access Private (Classroom members)
 */
const getMessage = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.params.messageId, req.user);
  res.send(message);
});

/**
 * Update message by ID
 * @route PATCH /api/v1/messages/:messageId
 * @access Private (Message sender only)
 */
const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessageById(req.params.messageId, req.body, req.user);
  res.send(message);
});

/**
 * Delete message by ID
 * @route DELETE /api/v1/messages/:messageId
 * @access Private (Message sender or Classroom admin)
 */
const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(req.params.messageId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get messages by classroom
 * @route GET /api/v1/messages/classroom/:classroomId
 * @access Private (Classroom members)
 */
const getMessagesByClassroom = catchAsync(async (req, res) => {
  const result = await messageService.getMessagesByClassroom(req.params.classroomId, req.user, req.query);
  res.send(result);
});

/**
 * Get messages by sender
 * @route GET /api/v1/messages/sender/:senderId
 * @access Private (Sender themselves or Admin)
 */
const getMessagesBySender = catchAsync(async (req, res) => {
  const result = await messageService.getMessagesBySender(req.params.senderId, req.user, req.query);
  res.send(result);
});

/**
 * Get my messages
 * @route GET /api/v1/messages/my-messages
 * @access Private (Users)
 */
const getMyMessages = catchAsync(async (req, res) => {
  const result = await messageService.getMessagesBySender(req.user._id, req.user, req.query);
  res.send(result);
});

/**
 * Search messages
 * @route GET /api/v1/messages/search
 * @access Private (Classroom members)
 */
const searchMessages = catchAsync(async (req, res) => {
  const result = await messageService.searchMessages(req.query, req.user);
  res.send(result);
});

/**
 * Get message statistics
 * @route GET /api/v1/messages/stats
 * @access Private (Admin)
 */
const getMessageStats = catchAsync(async (req, res) => {
  const stats = await messageService.getMessageStats();
  res.send(stats);
});

/**
 * Mark messages as read
 * @route POST /api/v1/messages/mark-read
 * @access Private (Classroom members)
 */
const markMessagesAsRead = catchAsync(async (req, res) => {
  const result = await messageService.markMessagesAsRead(req.body.messageIds, req.user._id);
  res.send(result);
});

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessagesByClassroom,
  getMessagesBySender,
  getMyMessages,
  searchMessages,
  getMessageStats,
  markMessagesAsRead,
};
