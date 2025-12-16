const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createClassroom = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    assigned_courses: Joi.array().items(Joi.string().custom(objectId)).optional(),
  }),
};

const getClassrooms = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().required().custom(objectId),
  }),
};

const updateClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      members: Joi.array().items(
        Joi.object().keys({
          user_id: Joi.string().required().custom(objectId),
          role: Joi.string().valid('student', 'admin', 'assistant').default('student'),
        })
      ),
      assigned_courses: Joi.array().items(Joi.string().custom(objectId)),
    })
    .min(1),
};

const deleteClassroom = {
  params: Joi.object().keys({
    classroomId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom,
};


