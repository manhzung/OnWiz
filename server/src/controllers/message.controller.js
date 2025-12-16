const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const messageService = require('../services/message.service');

const createMessage = catchAsync(async (req, res) => {
  const msg = await messageService.createMessage(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(msg);
});

const getMessages = catchAsync(async (req, res) => {
  const result = await messageService.queryMessages(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(req.params.messageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMessage,
  getMessages,
  deleteMessage,
};


