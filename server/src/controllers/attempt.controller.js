const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { attemptService } = require('../services');

/**
 * Create an attempt
 * @route POST /api/v1/attempts
 * @access Private (Users)
 */
const createAttempt = catchAsync(async (req, res) => {
  const attempt = await attemptService.createAttempt(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(attempt);
});

/**
 * Query attempts
 * @route GET /api/v1/attempts
 * @access Private (Users see their own, Admin sees all)
 */
const getAttempts = catchAsync(async (req, res) => {
  const result = await attemptService.queryAttempts(
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
 * Get attempt by ID
 * @route GET /api/v1/attempts/:attemptId
 * @access Private (Attempt owner or Admin)
 */
const getAttempt = catchAsync(async (req, res) => {
  const attempt = await attemptService.getAttemptById(req.params.attemptId, req.user);
  res.send(attempt);
});

/**
 * Update attempt by ID (Admin only)
 * @route PATCH /api/v1/attempts/:attemptId
 * @access Private (Admin only)
 */
const updateAttempt = catchAsync(async (req, res) => {
  const attempt = await attemptService.updateAttemptById(req.params.attemptId, req.body, req.user);
  res.send(attempt);
});

/**
 * Delete attempt by ID (Admin only)
 * @route DELETE /api/v1/attempts/:attemptId
 * @access Private (Admin only)
 */
const deleteAttempt = catchAsync(async (req, res) => {
  await attemptService.deleteAttemptById(req.params.attemptId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get attempts by user
 * @route GET /api/v1/attempts/user/:userId
 * @access Private (User themselves or Admin)
 */
const getAttemptsByUser = catchAsync(async (req, res) => {
  const result = await attemptService.getAttemptsByUser(req.params.userId, req.user, req.query);
  res.send(result);
});

/**
 * Get my attempts
 * @route GET /api/v1/attempts/my-attempts
 * @access Private (Users)
 */
const getMyAttempts = catchAsync(async (req, res) => {
  const result = await attemptService.getAttemptsByUser(req.user._id, req.user, req.query);
  res.send(result);
});

/**
 * Get attempts by quiz
 * @route GET /api/v1/attempts/quiz/:quizId
 * @access Private (Enrolled students or Instructor)
 */
const getAttemptsByQuiz = catchAsync(async (req, res) => {
  const result = await attemptService.getAttemptsByQuiz(req.params.quizId, req.user, req.query);
  res.send(result);
});

/**
 * Submit attempt
 * @route POST /api/v1/attempts/:attemptId/submit
 * @access Private (Attempt owner)
 */
const submitAttempt = catchAsync(async (req, res) => {
  const attempt = await attemptService.submitAttempt(req.params.attemptId, req.body, req.user._id);
  res.send(attempt);
});

/**
 * Get attempt statistics
 * @route GET /api/v1/attempts/stats
 * @access Private (Admin)
 */
const getAttemptStats = catchAsync(async (req, res) => {
  const stats = await attemptService.getAttemptStats();
  res.send(stats);
});

/**
 * Get quiz statistics for user
 * @route GET /api/v1/attempts/quiz/:quizId/stats
 * @access Private (Enrolled students)
 */
const getQuizStatsForUser = catchAsync(async (req, res) => {
  const stats = await attemptService.getQuizStatsForUser(req.params.quizId, req.user._id);
  res.send(stats);
});

module.exports = {
  createAttempt,
  getAttempts,
  getAttempt,
  updateAttempt,
  deleteAttempt,
  getAttemptsByUser,
  getMyAttempts,
  getAttemptsByQuiz,
  submitAttempt,
  getAttemptStats,
  getQuizStatsForUser,
};
