const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');

/**
 * Create a course
 * @route POST /api/v1/courses
 * @access Private (Instructor/Admin)
 */
const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(course);
});

/**
 * Query courses
 * @route GET /api/v1/courses
 * @access Public
 */
const getCourses = catchAsync(async (req, res) => {
  const result = await courseService.queryCourses(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

/**
 * Get course by ID
 * @route GET /api/v1/courses/:courseId
 * @access Public
 */
const getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);
  res.send(course);
});

/**
 * Get course by slug
 * @route GET /api/v1/courses/slug/:slug
 * @access Public
 */
const getCourseBySlug = catchAsync(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug);
  res.send(course);
});

/**
 * Update course by ID
 * @route PATCH /api/v1/courses/:courseId
 * @access Private (Instructor/Admin)
 */
const updateCourse = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseByIdWithAuth(req.params.courseId, req.body, req.user._id);
  res.send(course);
});

/**
 * Delete course by ID
 * @route DELETE /api/v1/courses/:courseId
 * @access Private (Instructor/Admin)
 */
const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourseByIdWithAuth(req.params.courseId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get courses by instructor
 * @route GET /api/v1/courses/instructor/:instructorId
 * @access Public
 */
const getCoursesByInstructor = catchAsync(async (req, res) => {
  const result = await courseService.getCoursesByInstructor(req.params.instructorId, req.query);
  res.send(result);
});

/**
 * Get courses by category
 * @route GET /api/v1/courses/category/:categoryId
 * @access Public
 */
const getCoursesByCategory = catchAsync(async (req, res) => {
  const result = await courseService.getCoursesByCategory(req.params.categoryId, req.query);
  res.send(result);
});

/**
 * Get featured courses
 * @route GET /api/v1/courses/featured
 * @access Public
 */
const getFeaturedCourses = catchAsync(async (req, res) => {
  const result = await courseService.getFeaturedCourses(req.query);
  res.send(result);
});

/**
 * Get published courses
 * @route GET /api/v1/courses/published
 * @access Public
 */
const getPublishedCourses = catchAsync(async (req, res) => {
  const result = await courseService.getPublishedCourses(req.query);
  res.send(result);
});

/**
 * Publish course
 * @route PATCH /api/v1/courses/:courseId/publish
 * @access Private (Instructor/Admin)
 */
const publishCourse = catchAsync(async (req, res) => {
  const course = await courseService.publishCourse(req.params.courseId, req.user._id);
  res.send(course);
});

/**
 * Unpublish course
 * @route PATCH /api/v1/courses/:courseId/unpublish
 * @access Private (Instructor/Admin)
 */
const unpublishCourse = catchAsync(async (req, res) => {
  const course = await courseService.unpublishCourse(req.params.courseId, req.user._id);
  res.send(course);
});

/**
 * Get course statistics
 * @route GET /api/v1/courses/stats
 * @access Private (Admin)
 */
const getCourseStats = catchAsync(async (req, res) => {
  const stats = await courseService.getCourseStats();
  res.send(stats);
});

/**
 * Get my courses (for instructors)
 * @route GET /api/v1/courses/my-courses
 * @access Private (Instructor)
 */
const getMyCourses = catchAsync(async (req, res) => {
  const result = await courseService.getCoursesByInstructor(req.user._id, req.query);
  res.send(result);
});

/**
 * Update course rating
 * @route PATCH /api/v1/courses/:courseId/rating
 * @access Private (Enrolled students)
 */
const updateCourseRating = catchAsync(async (req, res) => {
  const course = await courseService.updateCourseRating(req.params.courseId, req.body.rating);
  res.send(course);
});

/**
 * Search courses
 * @route GET /api/v1/courses/search
 * @access Public
 */
const searchCourses = catchAsync(async (req, res) => {
  const result = await courseService.searchCourses(req.query);
  res.send(result);
});

/**
 * Get course modules
 * @route GET /api/v1/courses/:courseId/modules
 * @access Private (Enrolled students or Instructor)
 */
const getCourseModules = catchAsync(async (req, res) => {
  const modules = await courseService.getCourseModules(req.params.courseId);
  res.send({ results: modules });
});

/**
 * Get course overview (for enrolled students)
 * @route GET /api/v1/courses/:courseId/overview
 * @access Private (Enrolled students)
 */
const getCourseOverview = catchAsync(async (req, res) => {
  const overview = await courseService.getCourseOverview(req.params.courseId, req.user._id);
  res.send(overview);
});

/**
 * Create module for course
 * @route POST /api/v1/courses/:courseId/modules
 * @access Private (Course instructor or admin)
 */
const createModule = catchAsync(async (req, res) => {
  const module = await courseService.createModule(req.params.courseId, req.body);
  res.status(httpStatus.CREATED).send(module);
});

/**
 * Create lesson for module
 * @route POST /api/v1/courses/modules/:moduleId/lessons
 * @access Private (Course instructor or admin)
 */
const createLesson = catchAsync(async (req, res) => {
  const lesson = await courseService.createLesson(req.params.moduleId, req.body);
  res.status(httpStatus.CREATED).send(lesson);
});

/**
 * Create question for quiz
 * @route POST /api/v1/courses/lessons/:lessonId/questions
 * @access Private (Course instructor or admin)
 */
const createQuestionForQuiz = catchAsync(async (req, res) => {
  const question = await courseService.createQuestionForQuiz(req.params.lessonId, req.body);
  res.status(httpStatus.CREATED).send(question);
});

/**
 * Get modules by course
 * @route GET /api/v1/courses/:courseId/modules
 * @access Private (Enrolled students or course members)
 */
const getModulesByCourse = catchAsync(async (req, res) => {
  const modules = await courseService.getModulesByCourse(req.params.courseId);
  res.send(modules);
});

/**
 * Get lessons by module
 * @route GET /api/v1/courses/modules/:moduleId/lessons
 * @access Private (Enrolled students or course members)
 */
const getLessonsByModule = catchAsync(async (req, res) => {
  const lessons = await courseService.getLessonsByModule(req.params.moduleId);
  res.send(lessons);
});

/**
 * Get lesson detail
 * @route GET /api/v1/courses/lessons/:lessonId
 * @access Private (Enrolled students or course members)
 */
const getLessonDetail = catchAsync(async (req, res) => {
  const lesson = await courseService.getLessonDetail(req.params.lessonId);
  res.send(lesson);
});

/**
 * Get quiz questions
 * @route GET /api/v1/courses/lessons/:lessonId/questions
 * @access Private (Enrolled students or course members)
 */
const getQuizQuestions = catchAsync(async (req, res) => {
  const questions = await courseService.getQuizQuestions(req.params.lessonId);
  res.send(questions);
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getCoursesByCategory,
  getFeaturedCourses,
  getPublishedCourses,
  publishCourse,
  unpublishCourse,
  getCourseStats,
  getMyCourses,
  updateCourseRating,
  searchCourses,
  getCourseModules,
  getCourseOverview,
  createModule,
  createLesson,
  createQuestionForQuiz,
  getModulesByCourse,
  getLessonsByModule,
  getLessonDetail,
  getQuizQuestions,
};
