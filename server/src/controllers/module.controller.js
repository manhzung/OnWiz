const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { moduleService } = require('../services');

/**
 * Create a module
 * @route POST /api/v1/modules
 * @access Private (Instructor/Admin)
 */
const createModule = catchAsync(async (req, res) => {
  const module = await moduleService.createModule(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(module);
});

/**
 * Query modules
 * @route GET /api/v1/modules
 * @access Private (Instructor/Admin)
 */
const getModules = catchAsync(async (req, res) => {
  const result = await moduleService.queryModules(req.query, {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  });
  res.send(result);
});

/**
 * Get module by ID
 * @route GET /api/v1/modules/:moduleId
 * @access Private (Instructor/Admin)
 */
const getModule = catchAsync(async (req, res) => {
  const module = await moduleService.getModuleById(req.params.moduleId, req.user._id);
  res.send(module);
});

/**
 * Update module by ID
 * @route PATCH /api/v1/modules/:moduleId
 * @access Private (Instructor/Admin)
 */
const updateModule = catchAsync(async (req, res) => {
  const module = await moduleService.updateModuleById(req.params.moduleId, req.body, req.user._id);
  res.send(module);
});

/**
 * Delete module by ID
 * @route DELETE /api/v1/modules/:moduleId
 * @access Private (Instructor/Admin)
 */
const deleteModule = catchAsync(async (req, res) => {
  await moduleService.deleteModuleById(req.params.moduleId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Get modules by course
 * @route GET /api/v1/modules/course/:courseId
 * @access Private (Instructor/Admin)
 */
const getModulesByCourse = catchAsync(async (req, res) => {
  const result = await moduleService.getModulesByCourse(req.params.courseId, req.user._id, req.query);
  res.send(result);
});

/**
 * Add lesson to module
 * @route POST /api/v1/modules/:moduleId/lessons
 * @access Private (Instructor/Admin)
 */
const addLessonToModule = catchAsync(async (req, res) => {
  const module = await moduleService.addLessonToModule(req.params.moduleId, req.body.lessonId, req.user._id);
  res.send(module);
});

/**
 * Remove lesson from module
 * @route DELETE /api/v1/modules/:moduleId/lessons/:lessonId
 * @access Private (Instructor/Admin)
 */
const removeLessonFromModule = catchAsync(async (req, res) => {
  const module = await moduleService.removeLessonFromModule(req.params.moduleId, req.params.lessonId, req.user._id);
  res.send(module);
});

/**
 * Reorder lessons in module
 * @route PATCH /api/v1/modules/:moduleId/reorder-lessons
 * @access Private (Instructor/Admin)
 */
const reorderLessons = catchAsync(async (req, res) => {
  const module = await moduleService.reorderLessons(req.params.moduleId, req.body.lessonIds, req.user._id);
  res.send(module);
});

/**
 * Get module statistics
 * @route GET /api/v1/modules/stats
 * @access Private (Admin)
 */
const getModuleStats = catchAsync(async (req, res) => {
  const stats = await moduleService.getModuleStats();
  res.send(stats);
});

module.exports = {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  getModulesByCourse,
  addLessonToModule,
  removeLessonFromModule,
  reorderLessons,
  getModuleStats,
};
