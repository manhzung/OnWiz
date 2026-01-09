const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createEnrollment = {
  body: Joi.object().keys({
    course_id: Joi.string().required().custom(objectId),
  }),
};

const getEnrollments = {
  query: Joi.object().keys({
    user_id: Joi.string().custom(objectId), // admin filter
    course_id: Joi.string().custom(objectId),
    status: Joi.string().valid('active', 'completed'),
    progress_min: Joi.number().min(0).max(100),
    progress_max: Joi.number().min(0).max(100),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
};

const updateEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      completed_lessons: Joi.array().items(Joi.string().custom(objectId)),
      current_position: Joi.object().keys({
        module_id: Joi.string().custom(objectId),
        lesson_id: Joi.string().custom(objectId),
        timestamp: Joi.number().integer().min(0),
      }),
      progress_percent: Joi.number().min(0).max(100),
      status: Joi.string().valid('active', 'completed'),
    })
    .min(1),
};

const deleteEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
};

const getEnrollmentsByCourse = {
  params: Joi.object().keys({
    courseId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEnrollmentsByStudent = {
  params: Joi.object().keys({
    studentId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const completeLesson = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    lessonId: Joi.string().custom(objectId).required(),
  }),
};

const updateCurrentPosition = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    module_id: Joi.string().custom(objectId).required(),
    lesson_id: Joi.string().custom(objectId).required(),
    timestamp: Joi.number().integer().min(0).default(0),
  }),
};

const completeEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
};

const getEnrollmentProgress = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  completeLesson,
  updateCurrentPosition,
  completeEnrollment,
  getEnrollmentProgress,
};
