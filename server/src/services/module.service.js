const httpStatus = require('http-status');
const { Course, Module, Lesson } = require('../models');
const ApiError = require('../utils/ApiError');
const { deleteLessonById } = require('./lesson.service');

/**
 * Create a module
 * @param {ObjectId} userId - User creating the module
 * @param {Object} moduleBody
 * @returns {Promise<Module>}
 */
const createModule = async (userId, moduleBody) => {
  // Verify course exists and user is the instructor
  const course = await Course.findById(moduleBody.course_id);
  if (!course) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course not found');
  }

  if (String(course.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to add modules to this course');
  }

  const module = await Module.create(moduleBody);

  // Add module to course's module_ids array
  course.module_ids.push(module._id);
  course.total_modules += 1;
  await course.save();

  return module;
};

/**
 * Query for modules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryModules = async (filter, options) => {
  const query = {};

  if (filter.course_id) {
    query.course_id = filter.course_id;
  }
  if (filter.title) {
    query.title = { $regex: filter.title, $options: 'i' };
  }

  const sort = options.sortBy || 'created_at:asc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Module.paginate) {
    return Module.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'course_id', select: 'title slug' },
        { path: 'lesson_ids', select: 'title type' },
      ],
    });
  }

  const modules = await Module.find(query)
    .populate('course_id', 'title slug')
    .populate('lesson_ids', 'title type')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: modules };
};

/**
 * Get module by id
 * @param {ObjectId} moduleId
 * @param {ObjectId} userId - User requesting the module (for authorization)
 * @returns {Promise<Module>}
 */
const getModuleById = async (moduleId, userId) => {
  const module = await Module.findById(moduleId)
    .populate('course_id', 'title slug instructor_id')
    .populate('lesson_ids', 'title type is_preview');

  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Check if user is authorized (instructor of the course or admin)
  const course = module.course_id;
  if (String(course.instructor_id) !== String(userId)) {
    // TODO: Add admin check here
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this module');
  }

  return module;
};

/**
 * Update module by id
 * @param {ObjectId} moduleId
 * @param {Object} updateBody
 * @param {ObjectId} userId - User making the update
 * @returns {Promise<Module>}
 */
const updateModuleById = async (moduleId, updateBody, userId) => {
  const module = await Module.findById(moduleId).populate('course_id', 'instructor_id');
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Check authorization
  if (String(module.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this module');
  }

  Object.assign(module, updateBody);
  await module.save();
  return module;
};

/**
 * Delete module by id
 * @param {ObjectId} moduleId
 * @param {ObjectId} userId - User making the delete request
 * @returns {Promise<Module>}
 */
const deleteModuleById = async (moduleId, userId) => {
  const module = await Module.findById(moduleId).populate('course_id', 'instructor_id');
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Check authorization
  if (String(module.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this module');
  }

  // Delete all lessons in this module
  const lessons = await Lesson.find({ module_id: moduleId });
  for (const lesson of lessons) {
    await deleteLessonById(lesson._id, false);
  }

  // Remove module from course's module_ids array
  const course = await Course.findById(module.course_id);
  if (course) {
    course.module_ids = course.module_ids.filter((id) => String(id) !== String(moduleId));
    if (course.total_modules > 0) {
      course.total_modules -= 1;
    }
    await course.save();
  }

  await module.deleteOne();
  return module;
};

/**
 * Get modules by course
 * @param {ObjectId} courseId
 * @param {ObjectId} userId - User requesting the modules
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getModulesByCourse = async (courseId, userId, options = {}) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check authorization
  if (String(course.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access modules of this course');
  }

  const filter = { course_id: courseId };
  return queryModules(filter, options);
};

/**
 * Add lesson to module
 * @param {ObjectId} moduleId
 * @param {ObjectId} lessonId
 * @param {ObjectId} userId - User making the change
 * @returns {Promise<Module>}
 */
const addLessonToModule = async (moduleId, lessonId, userId) => {
  const module = await Module.findById(moduleId).populate('course_id', 'instructor_id');
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Check authorization
  if (String(module.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to modify this module');
  }

  // Verify lesson exists and belongs to the same course
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  if (String(lesson.course_id) !== String(module.course_id._id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Lesson does not belong to the same course as the module');
  }

  // Add lesson if not already in the module
  if (!module.lesson_ids.includes(lessonId)) {
    module.lesson_ids.push(lessonId);
    await module.save();
  }

  return module;
};

/**
 * Remove lesson from module
 * @param {ObjectId} moduleId
 * @param {ObjectId} lessonId
 * @param {ObjectId} userId - User making the change
 * @returns {Promise<Module>}
 */
const removeLessonFromModule = async (moduleId, lessonId, userId) => {
  const module = await Module.findById(moduleId).populate('course_id', 'instructor_id');
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Check authorization
  if (String(module.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to modify this module');
  }

  // Remove lesson from module
  module.lesson_ids = module.lesson_ids.filter((id) => String(id) !== String(lessonId));
  await module.save();

  return module;
};

/**
 * Reorder lessons in module
 * @param {ObjectId} moduleId
 * @param {Array<ObjectId>} lessonIds - New order of lesson IDs
 * @param {ObjectId} userId - User making the change
 * @returns {Promise<Module>}
 */
const reorderLessons = async (moduleId, lessonIds, userId) => {
  const module = await Module.findById(moduleId).populate('course_id', 'instructor_id');
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  // Check authorization
  if (String(module.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to modify this module');
  }

  // Validate that all lesson IDs exist and belong to this module
  const existingLessons = await Lesson.find({
    _id: { $in: lessonIds },
    module_id: moduleId,
  });

  if (existingLessons.length !== lessonIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Some lessons do not exist or do not belong to this module');
  }

  module.lesson_ids = lessonIds;
  await module.save();

  return module;
};

/**
 * Get module statistics
 * @returns {Promise<Object>}
 */
const getModuleStats = async () => {
  const totalModules = await Module.countDocuments();

  const modulesByCourse = await Module.aggregate([
    {
      $group: {
        _id: '$course_id',
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        avgModulesPerCourse: { $avg: '$count' },
        maxModulesInCourse: { $max: '$count' },
        minModulesInCourse: { $min: '$count' },
      },
    },
  ]);

  const totalLessons = await Module.aggregate([
    {
      $unwind: '$lesson_ids',
    },
    {
      $count: 'totalLessons',
    },
  ]);

  return {
    totalModules,
    avgModulesPerCourse: modulesByCourse[0]?.avgModulesPerCourse || 0,
    maxModulesInCourse: modulesByCourse[0]?.maxModulesInCourse || 0,
    minModulesInCourse: modulesByCourse[0]?.minModulesInCourse || 0,
    totalLessonsInModules: totalLessons[0]?.totalLessons || 0,
  };
};

module.exports = {
  createModule,
  queryModules,
  getModuleById,
  updateModuleById,
  deleteModuleById,
  getModulesByCourse,
  addLessonToModule,
  removeLessonFromModule,
  reorderLessons,
  getModuleStats,
};
