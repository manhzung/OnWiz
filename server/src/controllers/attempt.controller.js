const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const attemptService = require('../services/attempt.service');

const createAttempt = catchAsync(async (req, res) => {
  const attempt = await attemptService.createAttempt(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(attempt);
});

const getAttempts = catchAsync(async (req, res) => {
  const result = await attemptService.queryAttempts(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

const getAttempt = catchAsync(async (req, res) => {
  const attempt = await attemptService.getAttemptById(req.params.attemptId, req.user);
  res.send(attempt);
});

const deleteAttempt = catchAsync(async (req, res) => {
  await attemptService.deleteAttemptById(req.params.attemptId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAttempt,
  getAttempts,
  getAttempt,
  deleteAttempt,
};


