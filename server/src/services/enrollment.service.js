const httpStatus = require('http-status');
const { Enrollment, Course, Lesson } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an enrollment
 * @param {ObjectId} userId - User enrolling in the course
 * @param {Object} enrollmentBody
 * @returns {Promise<Enrollment>}
 */
const createEnrollment = async (userId, enrollmentBody) => {
  // Check if course exists and is published
  const course = await Course.findById(enrollmentBody.course_id);
  if (!course) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course not found');
  }

  if (!course.is_published) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course is not published');
  }

  // Check if user is already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user_id: userId,
    course_id: enrollmentBody.course_id,
  });

  if (existingEnrollment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is already enrolled in this course');
  }

  // Count total lessons in the course
  const totalLessons = await Lesson.countDocuments({ course_id: enrollmentBody.course_id });

  const enrollment = await Enrollment.create({
    user_id: userId,
    course_id: enrollmentBody.course_id,
    completed_lessons: [],
    completedLessons: 0,
    totalLessons: totalLessons,
    current_position: {},
    progress_percent: 0,
    lastAccessedAt: new Date().toISOString(),
    status: 'active',
  });

  return enrollment;
};

/**
 * Query for enrollments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} currentUser - User making the request
 * @returns {Promise<QueryResult>}
 */
const queryEnrollments = async (filter, options, currentUser) => {
  const query = {};

  // Apply role-based filtering
  if (currentUser.role !== 'admin') {
    query.user_id = currentUser._id;
  } else {
    if (filter.user_id) {
      query.user_id = filter.user_id;
    }
  }

  if (filter.course_id) {
    query.course_id = filter.course_id;
  }
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.progress_min !== undefined) {
    query.progress_percent = { ...query.progress_percent, $gte: filter.progress_min };
  }
  if (filter.progress_max !== undefined) {
    query.progress_percent = { ...query.progress_percent, $lte: filter.progress_max };
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Enrollment.paginate) {
    return Enrollment.paginate(query, {
      sortBy: sort,
      limit,
      page,
      populate: [
        {
          path: 'course_id',
          select: 'title slug thumbnail_url category_id instructor pricing rating',
          populate: { path: 'category_id', select: 'name slug type' },
        },
        { path: 'user_id', select: 'name email' },
      ],
    });
  }

  const enrollments = await Enrollment.find(query)
    .populate({
      path: 'course_id',
      select: 'title slug thumbnail_url category_id instructor pricing rating',
      populate: { path: 'category_id', select: 'name slug type' },
    })
    .populate('user_id', 'name email')
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);

  return { results: enrollments };
};

/**
 * Get enrollment by id
 * @param {ObjectId} enrollmentId
 * @param {Object} currentUser - User making the request
 * @returns {Promise<Enrollment>}
 */
const getEnrollmentById = async (enrollmentId, currentUser) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate({
      path: 'course_id',
      select: 'title slug thumbnail_url category_id instructor pricing',
      populate: { path: 'category_id', select: 'name slug type' },
    })
    .populate('user_id', 'name email')
    .populate('completed_lessons', 'title type');

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  const isStudent = String(enrollment.user_id._id) === String(currentUser._id);
  const isInstructor = String(enrollment.course_id.instructor) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isStudent && !isInstructor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to access this enrollment');
  }

  return enrollment;
};

/**
 * Update enrollment by id
 * @param {ObjectId} enrollmentId
 * @param {Object} updateBody
 * @param {Object} currentUser - User making the update
 * @returns {Promise<Enrollment>}
 */
const updateEnrollmentById = async (enrollmentId, updateBody, currentUser) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate('course_id', 'instructor');
  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  const isStudent = String(enrollment.user_id) === String(currentUser._id);
  const isInstructor = String(enrollment.course_id.instructor) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isStudent && !isInstructor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this enrollment');
  }

  // Only instructors/admins can change certain fields
  if (updateBody.status && !isInstructor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to change enrollment status');
  }

  Object.assign(enrollment, updateBody);
  await enrollment.save();
  return enrollment;
};

/**
 * Delete enrollment by id
 * @param {ObjectId} enrollmentId
 * @param {Object} currentUser - User making the delete request
 * @returns {Promise<Enrollment>}
 */
const deleteEnrollmentById = async (enrollmentId, currentUser) => {
  const enrollment = await Enrollment.findById(enrollmentId).populate('course_id', 'instructor');
  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  const isStudent = String(enrollment.user_id) === String(currentUser._id);
  const isInstructor = String(enrollment.course_id.instructor) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isStudent && !isInstructor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this enrollment');
  }

  await enrollment.deleteOne();
  return enrollment;
};

/**
 * Get enrollments by course
 * @param {ObjectId} courseId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getEnrollmentsByCourse = async (courseId, currentUser, options = {}) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check authorization
  const isInstructor = String(course.instructor_id) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isInstructor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view enrollments for this course');
  }

  const filter = { course_id: courseId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryEnrollments(filter, queryOptions, currentUser);
};

/**
 * Get enrollments by student
 * @param {ObjectId} studentId
 * @param {Object} currentUser - User making the request
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getEnrollmentsByStudent = async (studentId, currentUser, options = {}) => {
  // Check authorization
  const isSelf = String(studentId) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view enrollments for this student');
  }

  const filter = { user_id: studentId };
  const queryOptions = {
    sortBy: options.sortBy || 'created_at:desc',
    limit: options.limit || 20,
    page: options.page || 1,
  };

  return queryEnrollments(filter, queryOptions, currentUser);
};

/**
 * Complete a lesson in enrollment
 * @param {ObjectId} enrollmentId
 * @param {ObjectId} lessonId
 * @param {ObjectId} userId - User completing the lesson
 * @returns {Promise<Enrollment>}
 */
const completeLesson = async (enrollmentId, lessonId, userId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  if (String(enrollment.user_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to complete lessons for this enrollment');
  }

  // Add lesson to completed lessons if not already completed
  if (!enrollment.completed_lessons.includes(lessonId)) {
    enrollment.completed_lessons.push(lessonId);
    enrollment.completedLessons += 1;

    // Update progress percentage
    if (enrollment.totalLessons > 0) {
      enrollment.progress_percent = Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100);
    }

    // Update last accessed time
    enrollment.lastAccessedAt = new Date().toISOString();

    await enrollment.save();
  }

  return enrollment;
};

/**
 * Update current position in enrollment
 * @param {ObjectId} enrollmentId
 * @param {Object} positionData - { module_id, lesson_id, timestamp }
 * @param {ObjectId} userId - User updating position
 * @returns {Promise<Enrollment>}
 */
const updateCurrentPosition = async (enrollmentId, positionData, userId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  if (String(enrollment.user_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update position for this enrollment');
  }

  enrollment.current_position = {
    module_id: positionData.module_id,
    lesson_id: positionData.lesson_id,
    timestamp: positionData.timestamp || 0,
  };

  enrollment.lastAccessedAt = new Date().toISOString();
  await enrollment.save();

  return enrollment;
};

/**
 * Mark enrollment as completed
 * @param {ObjectId} enrollmentId
 * @param {ObjectId} userId - User completing enrollment
 * @returns {Promise<Enrollment>}
 */
const completeEnrollment = async (enrollmentId, userId) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  if (String(enrollment.user_id) !== String(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to complete this enrollment');
  }

  enrollment.status = 'completed';
  enrollment.progress_percent = 100;
  await enrollment.save();

  return enrollment;
};

/**
 * Get enrollment progress details
 * @param {ObjectId} enrollmentId
 * @param {Object} currentUser - User requesting progress
 * @returns {Promise<Object>}
 */
const getEnrollmentProgress = async (enrollmentId, currentUser) => {
  const enrollment = await Enrollment.findById(enrollmentId)
    .populate({
      path: 'course_id',
      select: 'title total_modules',
      populate: {
        path: 'module_ids',
        populate: {
          path: 'lesson_ids',
          select: 'title type',
        },
      },
    })
    .populate('completed_lessons', 'title type module_id');

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  // Check authorization
  const isStudent = String(enrollment.user_id) === String(currentUser._id);
  const isInstructor = String(enrollment.course_id.instructor_id) === String(currentUser._id);
  const isAdmin = currentUser.role === 'admin';

  if (!isStudent && !isInstructor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to view progress for this enrollment');
  }

  const course = enrollment.course_id;
  const totalModules = course.module_ids?.length || 0;
  const totalLessons = enrollment.totalLessons;
  const completedLessons = enrollment.completedLessons;

  // Calculate module-wise progress
  const moduleProgress =
    course.module_ids?.map((module) => {
      const moduleLessons = module.lesson_ids || [];
      const completedModuleLessons = enrollment.completed_lessons.filter(
        (lesson) => String(lesson.module_id) === String(module._id)
      ).length;

      return {
        module_id: module._id,
        module_title: module.title,
        total_lessons: moduleLessons.length,
        completed_lessons: completedModuleLessons,
        progress_percent: moduleLessons.length > 0 ? Math.round((completedModuleLessons / moduleLessons.length) * 100) : 0,
      };
    }) || [];

  return {
    enrollment_id: enrollment._id,
    course_title: course.title,
    total_modules: totalModules,
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    progress_percent: enrollment.progress_percent,
    current_position: enrollment.current_position,
    module_progress: moduleProgress,
    status: enrollment.status,
    last_accessed: enrollment.lastAccessedAt,
  };
};

/**
 * Get enrollment statistics
 * @returns {Promise<Object>}
 */
const getEnrollmentStats = async () => {
  const totalEnrollments = await Enrollment.countDocuments();

  const enrollmentsByStatus = await Enrollment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

  const averageProgress = await Enrollment.aggregate([
    {
      $group: {
        _id: null,
        avgProgress: { $avg: '$progress_percent' },
        totalCompleted: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      },
    },
  ]);

  const enrollmentsByMonth = await Enrollment.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$created_at' },
          month: { $month: '$created_at' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  return {
    totalEnrollments,
    enrollmentsByStatus,
    averageProgress: averageProgress[0]?.avgProgress || 0,
    completedEnrollments: averageProgress[0]?.totalCompleted || 0,
    enrollmentsByMonth,
  };
};

module.exports = {
  createEnrollment,
  queryEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  completeLesson,
  updateCurrentPosition,
  completeEnrollment,
  getEnrollmentProgress,
  getEnrollmentStats,
};
