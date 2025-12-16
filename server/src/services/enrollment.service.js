const httpStatus = require('http-status');
const { Enrollment } = require('../models');
const ApiError = require('../utils/ApiError');

const createEnrollment = async (userId, body) => {
  const enrollment = await Enrollment.create({
    user_id: userId,
    course_id: body.course_id,
    completed_lessons: [],
    current_position: {},
    progress_percent: 0,
    status: 'active',
  });
  return enrollment;
};

const queryEnrollments = async (filter, options, currentUser) => {
  const query = {};

  if (currentUser.role !== 'admin') {
    query.user_id = currentUser.id;
  } else if (filter.user_id) {
    query.user_id = filter.user_id;
  }
  if (filter.course_id) {
    query.course_id = filter.course_id;
  }
  if (filter.status) {
    query.status = filter.status;
  }

  const sort = options.sortBy || 'created_at:desc';
  const limit = options.limit || 10;
  const page = options.page || 1;

  if (Enrollment.paginate) {
    return Enrollment.paginate(query, { sortBy: sort, limit, page });
  }
  const enrollments = await Enrollment.find(query)
    .sort(sort.replace(':', ' '))
    .limit(limit)
    .skip((page - 1) * limit);
  return { results: enrollments };
};

const getEnrollmentById = async (enrollmentId, currentUser) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }
  if (currentUser.role !== 'admin' && String(enrollment.user_id) !== String(currentUser.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  return enrollment;
};

const updateEnrollmentById = async (enrollmentId, updateBody, currentUser) => {
  const enrollment = await getEnrollmentById(enrollmentId, currentUser);

  if (updateBody.completed_lessons !== undefined) {
    enrollment.completed_lessons = updateBody.completed_lessons;
  }
  if (updateBody.current_position !== undefined) {
    enrollment.current_position = updateBody.current_position;
  }
  if (updateBody.progress_percent !== undefined) {
    enrollment.progress_percent = updateBody.progress_percent;
  }
  if (updateBody.status !== undefined) {
    enrollment.status = updateBody.status;
  }

  await enrollment.save();
  return enrollment;
};

const deleteEnrollmentById = async (enrollmentId, currentUser) => {
  const enrollment = await getEnrollmentById(enrollmentId, currentUser);
  await enrollment.deleteOne();
  return enrollment;
};

module.exports = {
  createEnrollment,
  queryEnrollments,
  getEnrollmentById,
  updateEnrollmentById,
  deleteEnrollmentById,
};


