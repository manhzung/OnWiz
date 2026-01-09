const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { questionService } = require('../services');

/**
 * Create a question
 * @route POST /api/v1/questions
 * @access Private (Instructor/Admin)
 */
const createQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createQuestion(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(question);
});

/**
 * Query questions
 * @route GET /api/v1/questions
 * @access Private (Instructor/Admin)
 */
const getQuestions = catchAsync(async (req, res) => {
  const result = await questionService.queryQuestions(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

/**
 * Get question by ID
 * @route GET /api/v1/questions/:questionId
 * @access Private (Instructor/Admin/Enrolled students for quiz access)
 */
const getQuestion = catchAsync(async (req, res) => {
  const question = await questionService.getQuestionById(req.params.questionId, req.user._id);
  res.send(question);
});

/**
 * Update question by ID
 * @route PATCH /api/v1/questions/:questionId
 * @access Private (Instructor/Admin)
 */
const updateQuestion = catchAsync(async (req, res) => {
  const question = await questionService.updateQuestionById(req.params.questionId, req.body, req.user._id);
  res.send(question);
});

/**
 * Delete question by ID
 * @route DELETE /api/v1/questions/:questionId
 * @access Private (Instructor/Admin)
 */
const deleteQuestion = catchAsync(async (req, res) => {
  await questionService.deleteQuestionById(req.params.questionId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Create single choice question
 * @route POST /api/v1/questions/single-choice
 * @access Private (Instructor/Admin)
 */
const createSingleChoiceQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createSingleChoiceQuestion(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(question);
});

/**
 * Create multiple choice question
 * @route POST /api/v1/questions/multiple-choice
 * @access Private (Instructor/Admin)
 */
const createMultipleChoiceQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createMultipleChoiceQuestion(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(question);
});

/**
 * Create fill-in question
 * @route POST /api/v1/questions/fill-in
 * @access Private (Instructor/Admin)
 */
const createFillInQuestion = catchAsync(async (req, res) => {
  const question = await questionService.createFillInQuestion(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(question);
});

/**
 * Get questions by difficulty
 * @route GET /api/v1/questions/difficulty/:difficulty
 * @access Private (Instructor/Admin)
 */
const getQuestionsByDifficulty = catchAsync(async (req, res) => {
  const result = await questionService.getQuestionsByDifficulty(req.params.difficulty, req.query);
  res.send(result);
});

/**
 * Get questions by type
 * @route GET /api/v1/questions/type/:type
 * @access Private (Instructor/Admin)
 */
const getQuestionsByType = catchAsync(async (req, res) => {
  const result = await questionService.getQuestionsByType(req.params.type, req.query);
  res.send(result);
});

/**
 * Get questions by course
 * @route GET /api/v1/questions/course/:courseId
 * @access Private (Instructor/Admin)
 */
const getQuestionsByCourse = catchAsync(async (req, res) => {
  const result = await questionService.getQuestionsByCourse(req.params.courseId, req.user._id, req.query);
  res.send(result);
});

/**
 * Search questions
 * @route GET /api/v1/questions/search
 * @access Private (Instructor/Admin)
 */
const searchQuestions = catchAsync(async (req, res) => {
  const result = await questionService.searchQuestions(req.query);
  res.send(result);
});

/**
 * Get question statistics
 * @route GET /api/v1/questions/stats
 * @access Private (Admin)
 */
const getQuestionStats = catchAsync(async (req, res) => {
  const stats = await questionService.getQuestionStats();
  res.send(stats);
});

/**
 * Bulk create questions
 * @route POST /api/v1/questions/bulk
 * @access Private (Instructor/Admin)
 */
const bulkCreateQuestions = catchAsync(async (req, res) => {
  const questions = await questionService.bulkCreateQuestions(req.user._id, req.body.questions);
  res.status(httpStatus.CREATED).send({ results: questions });
});

/**
 * Validate question answer
 * @route POST /api/v1/questions/:questionId/validate
 * @access Private (Enrolled students)
 */
const validateAnswer = catchAsync(async (req, res) => {
  const result = await questionService.validateAnswer(req.params.questionId, req.body.answer, req.user._id);
  res.send(result);
});

module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  createSingleChoiceQuestion,
  createMultipleChoiceQuestion,
  createFillInQuestion,
  getQuestionsByDifficulty,
  getQuestionsByType,
  getQuestionsByCourse,
  searchQuestions,
  getQuestionStats,
  bulkCreateQuestions,
  validateAnswer,
};
