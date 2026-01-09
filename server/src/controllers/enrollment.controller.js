const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { enrollmentService } = require('../services');

/**
 * Create an enrollment
 * @route POST /api/v1/enrollments
 * @access Private (Students)
 */
const createEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(enrollment);
});

/**
 * Query enrollments
 * @route GET /api/v1/enrollments
 * @access Private (Users - filtered by role)
 */
const getEnrollments = catchAsync(async (req, res) => {
  const result = await enrollmentService.queryEnrollments(
    req.query,
    { sortBy: req.query.sortBy, limit: req.query.limit, page: req.query.page },
    req.user
  );
  res.send(result);
});

/**
 * Get enrollment by ID
 * @route GET /api/v1/enrollments/:enrollmentId
 * @access Private (Student or Instructor of the course)
 */
const getEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.enrollmentId, req.user);
  res.send(enrollment);
});

/**
 * Update enrollment by ID
 * @route PATCH /api/v1/enrollments/:enrollmentId
 * @access Private (Student or Instructor)
 */
const updateEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollmentById(req.params.enrollmentId, req.body, req.user);
  res.send(enrollment);
});

/**
 * Delete enrollment by ID
 * @route DELETE /api/v1/enrollments/:enrollmentId
 * @access Private (Student or Instructor)
 */
const deleteEnrollment = catchAsync(async (req, res) => {
  await enrollmentService.deleteEnrollmentById(req.params.enrollmentId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get enrollments by course
 * @route GET /api/v1/enrollments/course/:courseId
 * @access Private (Instructor of the course or Admin)
 */
const getEnrollmentsByCourse = catchAsync(async (req, res) => {
  const result = await enrollmentService.getEnrollmentsByCourse(req.params.courseId, req.user, req.query);
  res.send(result);
});

/**
 * Get enrollments by student
 * @route GET /api/v1/enrollments/student/:studentId
 * @access Private (Student themselves or Admin)
 */
const getEnrollmentsByStudent = catchAsync(async (req, res) => {
  const result = await enrollmentService.getEnrollmentsByStudent(req.params.studentId, req.user, req.query);
  res.send(result);
});

/**
 * Get my enrollments
 * @route GET /api/v1/enrollments/my-enrollments
 * @access Private (Students)
 */
const getMyEnrollments = catchAsync(async (req, res) => {
  const result = await enrollmentService.getEnrollmentsByStudent(req.user._id, req.user, req.query);
  res.send(result);
});

/**
 * Complete lesson
 * @route POST /api/v1/enrollments/:enrollmentId/complete-lesson
 * @access Private (Student)
 */
const completeLesson = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.completeLesson(req.params.enrollmentId, req.body.lessonId, req.user._id);
  res.send(enrollment);
});

/**
 * Update current position
 * @route PATCH /api/v1/enrollments/:enrollmentId/position
 * @access Private (Student)
 */
const updateCurrentPosition = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateCurrentPosition(req.params.enrollmentId, req.body, req.user._id);
  res.send(enrollment);
});

/**
 * Mark enrollment as completed
 * @route PATCH /api/v1/enrollments/:enrollmentId/complete
 * @access Private (Student)
 */
const completeEnrollment = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.completeEnrollment(req.params.enrollmentId, req.user._id);
  res.send(enrollment);
});

/**
 * Get enrollment progress
 * @route GET /api/v1/enrollments/:enrollmentId/progress
 * @access Private (Student or Instructor)
 */
const getEnrollmentProgress = catchAsync(async (req, res) => {
  const progress = await enrollmentService.getEnrollmentProgress(req.params.enrollmentId, req.user);
  res.send(progress);
});

/**
 * Get enrollment statistics
 * @route GET /api/v1/enrollments/stats
 * @access Private (Admin)
 */
const getEnrollmentStats = catchAsync(async (req, res) => {
  const stats = await enrollmentService.getEnrollmentStats();
  res.send(stats);
});

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  getMyEnrollments,
  completeLesson,
  updateCurrentPosition,
  completeEnrollment,
  getEnrollmentProgress,
  getEnrollmentStats,
};
