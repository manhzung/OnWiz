const httpStatus = require('http-status');
const { Lesson, Module, Course, LessonVideo, LessonTheory, LessonQuiz, Enrollment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a lesson
 * @param {ObjectId} userId - User creating the lesson
 * @param {Object} lessonBody
 * @returns {Promise<Lesson>}
 */
const createLesson = async (userId, lessonBody) => {
  // Verify module exists and user is authorized
  const module = await Module.findById(lessonBody.module_id).populate('course_id');
  if (!module) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Module not found');
  }

  const course = module.course_id;
  if (String(course.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to create lessons for this course');
  }

  // Create resource based on lesson type
  let resource;
  if (lessonBody.type === 'video') {
    resource = await LessonVideo.create({
      provider: lessonBody.provider,
      url: lessonBody.url,
      duration: lessonBody.duration,
      transcript: lessonBody.transcript || '',
    });
  } else if (lessonBody.type === 'theory') {
    resource = await LessonTheory.create({
      content_html: lessonBody.content_html,
      attachments: lessonBody.attachments || [],
      reading_time_minutes: lessonBody.reading_time_minutes || 0,
    });
  } else if (lessonBody.type === 'quiz') {
    resource = await LessonQuiz.create({
      settings: lessonBody.settings || {},
      question_ids: lessonBody.question_ids || [],
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid lesson type');
  }

  // Create lesson
  const lesson = await Lesson.create({
    module_id: lessonBody.module_id,
    course_id: course._id,
    title: lessonBody.title,
    slug: lessonBody.slug,
    type: lessonBody.type,
    resource_id: resource._id,
    is_preview: lessonBody.is_preview || false,
  });

  // Add lesson to module
  module.lesson_ids.push(lesson._id);
  await module.save();

  return lesson;
};

/**
 * Create a video lesson
 * @param {ObjectId} userId - User creating the lesson
 * @param {Object} lessonBody
 * @returns {Promise<Lesson>}
 */
const createVideoLesson = async (userId, lessonBody) => {
  const videoBody = {
    ...lessonBody,
    type: 'video',
  };
  return createLesson(userId, videoBody);
};

/**
 * Create a theory lesson
 * @param {ObjectId} userId - User creating the lesson
 * @param {Object} lessonBody
 * @returns {Promise<Lesson>}
 */
const createTheoryLesson = async (userId, lessonBody) => {
  const theoryBody = {
    ...lessonBody,
    type: 'theory',
  };
  return createLesson(userId, theoryBody);
};

/**
 * Create a quiz lesson
 * @param {ObjectId} userId - User creating the lesson
 * @param {Object} lessonBody
 * @returns {Promise<Lesson>}
 */
const createQuizLesson = async (userId, lessonBody) => {
  const quizBody = {
    ...lessonBody,
    type: 'quiz',
  };
  return createLesson(userId, quizBody);
};

/**
 * Query for lessons
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLessons = async (filter, options) => {
  const query = {};

  if (filter.module_id) {
    query.module_id = filter.module_id;
  }
  if (filter.course_id) {
    query.course_id = filter.course_id;
  }
  if (filter.type) {
    query.type = filter.type;
  }
  if (filter.title) {
    query.title = { $regex: filter.title, $options: 'i' };
  }
  if (filter.is_preview !== undefined) {
    query.is_preview = filter.is_preview;
  }

  const sort = options.sortBy || 'created_at:asc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Lesson.paginate) {
    return Lesson.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        { path: 'module_id', select: 'title' },
        { path: 'course_id', select: 'title slug' },
      ],
    });
  }

  const lessons = await Lesson.find(query)
    .populate('module_id', 'title')
    .populate('course_id', 'title slug')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: lessons };
};

/**
 * Get lesson by id
 * @param {ObjectId} lessonId
 * @param {ObjectId} userId - User requesting the lesson
 * @returns {Promise<Lesson>}
 */
const getLessonById = async (lessonId, userId) => {
  const lesson = await Lesson.findById(lessonId)
    .populate('module_id', 'title')
    .populate('course_id', 'title slug instructor_id');

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Check authorization (instructor or enrolled student for non-preview lessons)
  const course = lesson.course_id;
  const isInstructor = String(course.instructor_id) === String(userId);

  if (!isInstructor && !lesson.is_preview) {
    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: course._id,
    });

    if (!enrollment) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied. Must be enrolled in the course.');
    }
  }

  return lesson;
};

/**
 * Update lesson by id
 * @param {ObjectId} lessonId
 * @param {Object} updateBody
 * @param {ObjectId} userId - User making the update
 * @returns {Promise<Lesson>}
 */
const updateLessonById = async (lessonId, updateBody, userId) => {
  const lesson = await Lesson.findById(lessonId).populate('course_id', 'instructor_id');
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Check authorization
  if (String(lesson.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this lesson');
  }

  // Update lesson basic info
  Object.assign(lesson, updateBody);
  await lesson.save();

  // Update resource if needed
  if (updateBody.resource) {
    if (lesson.type === 'video') {
      await LessonVideo.findByIdAndUpdate(lesson.resource_id, updateBody.resource);
    } else if (lesson.type === 'theory') {
      await LessonTheory.findByIdAndUpdate(lesson.resource_id, updateBody.resource);
    } else if (lesson.type === 'quiz') {
      await LessonQuiz.findByIdAndUpdate(lesson.resource_id, updateBody.resource);
    }
  }

  return lesson;
};

/**
 * Delete lesson by id
 * @param {ObjectId} lessonId
 * @param {ObjectId} userId - User making the delete request
 * @returns {Promise<Lesson>}
 */
const deleteLessonById = async (lessonId, userId) => {
  const lesson = await Lesson.findById(lessonId).populate('course_id', 'instructor_id');
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Check authorization
  if (String(lesson.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this lesson');
  }

  // Remove lesson from module
  const module = await Module.findById(lesson.module_id);
  if (module) {
    module.lesson_ids = module.lesson_ids.filter((id) => String(id) !== String(lessonId));
    await module.save();
  }

  // Delete resource
  if (lesson.type === 'video') {
    await LessonVideo.findByIdAndDelete(lesson.resource_id);
  } else if (lesson.type === 'theory') {
    await LessonTheory.findByIdAndDelete(lesson.resource_id);
  } else if (lesson.type === 'quiz') {
    await LessonQuiz.findByIdAndDelete(lesson.resource_id);
  }

  await lesson.deleteOne();
  return lesson;
};

/**
 * Get lessons by module
 * @param {ObjectId} moduleId
 * @param {ObjectId} userId - User requesting the lessons
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getLessonsByModule = async (moduleId, userId, options = {}) => {
  const module = await Module.findById(moduleId).populate('course_id');
  if (!module) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Module not found');
  }

  const course = module.course_id;
  const isInstructor = String(course.instructor_id) === String(userId);

  if (!isInstructor) {
    // Check enrollment for non-instructors
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: course._id,
    });

    if (!enrollment) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access lessons in this module');
    }
  }

  const filter = { module_id: moduleId };
  return queryLessons(filter, options);
};

/**
 * Get lessons by course
 * @param {ObjectId} courseId
 * @param {ObjectId} userId - User requesting the lessons
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getLessonsByCourse = async (courseId, userId, options = {}) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isInstructor = String(course.instructor_id) === String(userId);

  if (!isInstructor) {
    // Check enrollment for non-instructors
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId,
    });

    if (!enrollment) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access lessons in this course');
    }
  }

  const filter = { course_id: courseId };
  return queryLessons(filter, options);
};

/**
 * Update lesson preview status
 * @param {ObjectId} lessonId
 * @param {boolean} isPreview
 * @param {ObjectId} userId - User making the change
 * @returns {Promise<Lesson>}
 */
const updateLessonPreview = async (lessonId, isPreview, userId) => {
  const lesson = await Lesson.findById(lessonId).populate('course_id', 'instructor_id');
  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Check authorization
  if (String(lesson.course_id.instructor_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to modify this lesson');
  }

  lesson.is_preview = isPreview;
  await lesson.save();
  return lesson;
};

/**
 * Get lesson content for student
 * @param {ObjectId} lessonId
 * @param {ObjectId} userId - Student requesting the content
 * @returns {Promise<Object>}
 */
const getLessonContent = async (lessonId, userId) => {
  const lesson = await Lesson.findById(lessonId)
    .populate('module_id', 'title')
    .populate('course_id', 'title slug instructor_id');

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  const course = lesson.course_id;
  const isInstructor = String(course.instructor_id) === String(userId);

  // Check access permissions
  if (!isInstructor && !lesson.is_preview) {
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: course._id,
    });

    if (!enrollment) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access denied. Must be enrolled in the course.');
    }
  }

  // Get resource content
  let resource = null;
  if (lesson.type === 'video') {
    resource = await LessonVideo.findById(lesson.resource_id);
  } else if (lesson.type === 'theory') {
    resource = await LessonTheory.findById(lesson.resource_id);
  } else if (lesson.type === 'quiz') {
    resource = await LessonQuiz.findById(lesson.resource_id).populate('question_ids');
  }

  return {
    lesson,
    resource,
  };
};

/**
 * Get lesson statistics
 * @returns {Promise<Object>}
 */
const getLessonStats = async () => {
  const totalLessons = await Lesson.countDocuments();

  const lessonsByType = await Lesson.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);

  const previewLessons = await Lesson.countDocuments({ is_preview: true });
  const totalVideoDuration = await LessonVideo.aggregate([{ $group: { _id: null, totalDuration: { $sum: '$duration' } } }]);

  return {
    totalLessons,
    lessonsByType,
    previewLessons,
    totalVideoDuration: totalVideoDuration[0]?.totalDuration || 0,
  };
};

module.exports = {
  createLesson,
  createVideoLesson,
  createTheoryLesson,
  createQuizLesson,
  queryLessons,
  getLessonById,
  updateLessonById,
  deleteLessonById,
  getLessonsByModule,
  getLessonsByCourse,
  updateLessonPreview,
  getLessonContent,
  getLessonStats,
  // Keep legacy functions for backward compatibility
  getLessonDetail: getLessonContent,
  updateLesson: updateLessonById,
  deleteLesson: deleteLessonById,
  deleteLessonById,
};
