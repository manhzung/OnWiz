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
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().required().custom(objectId),
  }),
};

const updateEnrollment = {
  params: Joi.object().keys({
    enrollmentId: Joi.string().required().custom(objectId),
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
    enrollmentId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
};


