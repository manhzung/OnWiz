const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { lessonService } = require('../services');

/**
 * Create a lesson
 * @route POST /api/v1/lessons
 * @access Private (Instructor/Admin)
 */
const createLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.createLesson(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

/**
 * Query lessons
 * @route GET /api/v1/lessons
 * @access Private (Instructor/Admin)
 */
const getLessons = catchAsync(async (req, res) => {
  const result = await lessonService.queryLessons(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

/**
 * Get lesson by ID
 * @route GET /api/v1/lessons/:lessonId
 * @access Private (Instructor/Admin/Enrolled students)
 */
const getLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.getLessonById(req.params.lessonId, req.user._id);
  res.send(lesson);
});

/**
 * Update lesson by ID
 * @route PATCH /api/v1/lessons/:lessonId
 * @access Private (Instructor/Admin)
 */
const updateLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.updateLessonById(req.params.lessonId, req.body, req.user._id);
  res.send(lesson);
});

/**
 * Delete lesson by ID
 * @route DELETE /api/v1/lessons/:lessonId
 * @access Private (Instructor/Admin)
 */
const deleteLesson = catchAsync(async (req, res) => {
  await lessonService.deleteLessonById(req.params.lessonId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get lessons by module
 * @route GET /api/v1/lessons/module/:moduleId
 * @access Private (Instructor/Admin/Enrolled students)
 */
const getLessonsByModule = catchAsync(async (req, res) => {
  const result = await lessonService.getLessonsByModule(req.params.moduleId, req.user._id, req.query);
  res.send(result);
});

/**
 * Get lessons by course
 * @route GET /api/v1/lessons/course/:courseId
 * @access Private (Instructor/Admin/Enrolled students)
 */
const getLessonsByCourse = catchAsync(async (req, res) => {
  const result = await lessonService.getLessonsByCourse(req.params.courseId, req.user._id, req.query);
  res.send(result);
});

/**
 * Create video lesson
 * @route POST /api/v1/lessons/video
 * @access Private (Instructor/Admin)
 */
const createVideoLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.createVideoLesson(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

/**
 * Create theory lesson
 * @route POST /api/v1/lessons/theory
 * @access Private (Instructor/Admin)
 */
const createTheoryLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.createTheoryLesson(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

/**
 * Create quiz lesson
 * @route POST /api/v1/lessons/quiz
 * @access Private (Instructor/Admin)
 */
const createQuizLesson = catchAsync(async (req, res) => {
  const lesson = await lessonService.createQuizLesson(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

/**
 * Update lesson preview status
 * @route PATCH /api/v1/lessons/:lessonId/preview
 * @access Private (Instructor/Admin)
 */
const updateLessonPreview = catchAsync(async (req, res) => {
  const lesson = await lessonService.updateLessonPreview(req.params.lessonId, req.body.is_preview, req.user._id);
  res.send(lesson);
});

/**
 * Get lesson statistics
 * @route GET /api/v1/lessons/stats
 * @access Private (Admin)
 */
const getLessonStats = catchAsync(async (req, res) => {
  const stats = await lessonService.getLessonStats();
  res.send(stats);
});

/**
 * Get lesson content for student
 * @route GET /api/v1/lessons/:lessonId/content
 * @access Private (Enrolled students)
 */
const getLessonContent = catchAsync(async (req, res) => {
  const content = await lessonService.getLessonContent(req.params.lessonId, req.user._id);
  res.send(content);
});

module.exports = {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  getLessonsByModule,
  getLessonsByCourse,
  createVideoLesson,
  createTheoryLesson,
  createQuizLesson,
  updateLessonPreview,
  getLessonStats,
  getLessonContent,
};
